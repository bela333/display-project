"use server";
import { PING_TIMEOUT } from "@/lib/consts";
import redis from "@/app/db/redis";
import { screenPing } from "@/app/db/redis-keys";

export async function sendPing(roomID: string, screenID: number) {
  await redis.set(screenPing(roomID, screenID), 1, {
    EX: PING_TIMEOUT,
  });
}
