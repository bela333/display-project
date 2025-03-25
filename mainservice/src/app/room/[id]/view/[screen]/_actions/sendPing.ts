"use server";
import redis from "@/db/redis";
import { screenPing } from "@/db/redis-keys";
import { PING_TIMEOUT } from "@/lib/consts";

export async function sendPing(roomID: string, screenID: number) {
  await redis.set(screenPing(roomID, screenID), 1, {
    EX: PING_TIMEOUT,
  });
}
