"use server";

import { EXPIRE_SECONDS } from "@/lib/consts";
import redis from "@/lib/redis";
import { roomCount, roomRoot } from "@/lib/redis-keys";
import { keyToCode } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function createRoom() {
  const key = await redis.incr(roomCount());

  const code = keyToCode(key).toLowerCase();

  //TODO: Setup room properly
  //TODO: Create helper functions for redis keys
  await redis.set(roomRoot(code), 1, {
    EX: EXPIRE_SECONDS,
  });

  redirect(`/room/${code}/config`);
}
