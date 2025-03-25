"use server";

import redis from "@/db/redis";
import {
  roomCount,
  roomMode,
  roomRoot,
  roomScreenCount,
} from "@/db/redis-keys";
import { EXPIRE_SECONDS } from "@/lib/consts";
import { keyToCode } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function createRoom() {
  const key = await redis.incr(roomCount());

  const code = keyToCode(key).toLowerCase();

  await redis.set(roomScreenCount(code), 0, {
    EX: EXPIRE_SECONDS,
  });
  await redis.set(roomRoot(code), 1, {
    EX: EXPIRE_SECONDS,
  });
  await redis.set(roomMode(code), "calibration", {
    EX: EXPIRE_SECONDS,
  });

  redirect(`/room/${code}/config`);
}
