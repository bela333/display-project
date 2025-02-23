"use server";

import { serializeScreen } from "@/app/db/_serialization";
import redis from "@/app/db/redis";
import {
  roomPubSub,
  roomScreenAvailable,
  screenHomography,
} from "@/app/db/redis-keys";
import { EXPIRE_SECONDS } from "@/lib/consts";
import { codeValidation } from "@/lib/utils";
import { z } from "zod";

type ApriltagScreenRequest = {
  id: number;
  screenSize: [number, number];
  codeOffset: [number, number];
  codeSize: number;
};

const apriltagResponse = z.array(
  z.object({
    id: z.number(),
    homography: z.array(z.array(z.number()).length(3)).length(3),
  })
);

type ApriltagResponse = z.infer<typeof apriltagResponse>;

export default async function uploadFile(params: FormData) {
  const room = params.get("room");
  const file = params.get("file");
  const roomRes = await codeValidation().safeParseAsync(room);

  if (!roomRes.success) {
    return null;
    /*return {
      errors: res.error.flatten().fieldErrors,
    };*/
  }

  // Get code informatio for room
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

  // Send request to microservice

  const req = new FormData();
  req.append("params", JSON.stringify({ screens }));
  req.append("file", file);

  const resp = await fetch(`${process.env.APRILTAG_URL}`, {
    method: "POST",
    body: req,
  });

  const respJson: ApriltagResponse = await apriltagResponse.parseAsync(
    await resp.json()
  );

  await Promise.all(
    respJson.map((screenResponse) =>
      redis.set(
        screenHomography(roomRes.data, screenResponse.id),
        JSON.stringify(screenResponse.homography),
        {
          EX: EXPIRE_SECONDS,
        }
      )
    )
  );
  await redis.publish(roomPubSub(room), "ping");
}
