"use server";
import redis from "@/db/redis";
import { roomPubSub, roomScreenAvailable } from "@/db/redis-keys";
import { EXPIRE_SECONDS } from "@/lib/consts";

export async function registerScreen(roomID: string, screenID: number) {
  await redis.sAdd(roomScreenAvailable(roomID), String(screenID));
  await redis.expire(roomScreenAvailable(roomID), EXPIRE_SECONDS);
}

export async function deregisterScreen(roomID: string, screenID: number) {
  await redis.sRem(roomScreenAvailable(roomID), String(screenID));
  await redis.publish(roomPubSub(roomID), "ping");
}
