"use server";

import { EXPIRE_SECONDS } from "@/lib/consts";
import redis from "@/lib/redis";
import { roomCount, roomRoot, roomScreenCount } from "@/lib/redis-keys";
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

  redirect(`/room/${code}/config`);
}
