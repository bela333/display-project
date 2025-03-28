"use server";

import { serializeScreen } from "@/db/serialization";
import roomImageObject from "@/db/objects/roomImage";
import roomPubSubObject from "@/db/objects/roomPubSub";
import roomScreenAvailableObject from "@/db/objects/roomScreenAvailable";
import screenHomographyObject, {
  type HomographyMatrix,
} from "@/db/objects/screenHomography";
import { s3Client_internal } from "@/lib/s3";
import { codeValidation } from "@/lib/utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

  const screenIds = await roomScreenAvailableObject.members(roomRes.data);
  for (const screen of screenIds) {
    const screenConfig = await serializeScreen(roomRes.data, screen);
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
      id: screen,
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
      screenHomographyObject.set(
        roomRes.data,
        screenResponse.id,
        screenResponse.homography as HomographyMatrix // Array size is checked by zod
      )
    )
  );

  await roomImageObject.name.set(roomRes.data, warpedname);
  await roomImageObject.width.set(roomRes.data, respJson.width);
  await roomImageObject.height.set(roomRes.data, respJson.height);

  await roomPubSubObject.ping(roomRes.data);
  return warpedname;
}
