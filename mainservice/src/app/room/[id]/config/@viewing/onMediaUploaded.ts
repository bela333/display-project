"use server";

import redis from "@/db/redis";
import {
  roomContentFilename,
  roomContentType,
  roomPubSub,
} from "@/db/redis-keys";
import { codeValidation } from "@/lib/utils";

export async function onMediaUploaded(room: string, filename: string) {
  const roomRes = await codeValidation().safeParseAsync(room);

  if (!roomRes.success) {
    return;
  }
  await redis.set(roomContentType(room), "image");
  await redis.set(roomContentFilename(room), filename);

  await redis.publish(roomPubSub(roomRes.data), "ping");
}
