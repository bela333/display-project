"use server";

import { serializeScreen } from "@/db/_serialization";
import redis from "@/db/redis";
import {
  roomImageHeight,
  roomImageName,
  roomImageWidth,
  roomPubSub,
  roomScreenAvailable,
  screenHomography,
} from "@/db/redis-keys";
import { EXPIRE_SECONDS } from "@/lib/consts";
import { s3Client_internal } from "@/lib/s3";
import { codeValidation } from "@/lib/utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DateTime } from "luxon";
import { z } from "zod";

type ApriltagScreenRequest = {
  id: number;
  screenSize: [number, number];
  codeOffset: [number, number];
  codeSize: number;
};

const apriltagResponse = z.object({
  width: z.number(),
  height: z.number(),
  screens: z.array(
    z.object({
      id: z.number(),
      homography: z.array(z.array(z.number()).length(3)).length(3),
    })
  ),
});

type ApriltagResponse = z.infer<typeof apriltagResponse>;

export default async function processFile(room: string, filename: string) {
  const roomRes = await codeValidation().safeParseAsync(room);

  if (!roomRes.success) {
    return;
    /*return {
      errors: res.error.flatten().fieldErrors,
    };*/
  }

  // Get code information for room
  const screens: ApriltagScreenRequest[] = [];

  const screenIds: string[] = await redis.sMembers(
    roomScreenAvailable(roomRes.data)
  );

  for (const screen of screenIds) {
    const screenConfig = await serializeScreen(roomRes.data, Number(screen));
    if (screenConfig === null) {
      continue;
    }
    const bordered = Math.min(screenConfig.width, screenConfig.height);
    const codeSize = (bordered / 10) * 8;
    const screenSizeX = screenConfig.width * 2;
    const screenSizeY = screenConfig.height;
    const offsetX =
      (screenConfig.width - bordered) / 2 + screenConfig.width + bordered / 10;
    const offsetY = (screenConfig.height - bordered) / 2 + bordered / 10;
    screens.push({
      id: Number(screen),
      screenSize: [screenSizeX | 0, screenSizeY | 0],
      codeOffset: [offsetX | 0, offsetY | 0],
      codeSize: codeSize | 0,
    });
  }

  const [name, extension] = filename.split(".");
  const warpedname = `${name}.warped.jpg`;

  // Create PUT URL for result image upload
  const req = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: warpedname,
    Expires: DateTime.now().plus({ days: 1 }).toJSDate(),
  });
  const upload_url = await getSignedUrl(s3Client_internal, req, {
    expiresIn: 300,
  });

  // Send request to microservice
  const resp = await fetch(`${process.env.APRILTAG_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename,
      screens,
      upload_url,
    }),
  });

  const respJson: ApriltagResponse = await apriltagResponse.parseAsync(
    await resp.json()
  );

  // TODO: Remove homographies that don't appear in the response
  await Promise.all(
    respJson.screens.map((screenResponse) =>
      redis.set(
        screenHomography(roomRes.data, screenResponse.id),
        JSON.stringify(screenResponse.homography),
        {
          EX: EXPIRE_SECONDS,
        }
      )
    )
  );

  await redis.set(roomImageName(roomRes.data), warpedname, {
    EX: EXPIRE_SECONDS,
  });
  await redis.set(roomImageWidth(roomRes.data), respJson.width, {
    EX: EXPIRE_SECONDS,
  });
  await redis.set(roomImageHeight(roomRes.data), respJson.height, {
    EX: EXPIRE_SECONDS,
  });

  await redis.publish(roomPubSub(roomRes.data), "ping");
  return warpedname;
}
