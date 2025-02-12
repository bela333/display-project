"use server";

import { EXPIRE_SECONDS } from "@/lib/consts";
import redis from "@/lib/redis";
import { obfuscateKey } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function createRoom() {
  const key = await redis.incr("roomCount");

  const code = obfuscateKey(key).toLowerCase();

  //TODO: Setup room properly
  //TODO: Create helper functions for redis keys
  await redis.set(`room:${code}`, 1, {
    EX: EXPIRE_SECONDS,
  });

  redirect(`/room/${code}/config`);
}
