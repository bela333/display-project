"use server";
import { EXPIRE_SECONDS } from "@/lib/consts";
import redis from "@/lib/redis";
import { roomPubSub, roomScreenAvailable } from "@/lib/redis-keys";

export async function registerScreen(roomID: string, screenID: number) {
  await redis.sAdd(roomScreenAvailable(roomID), String(screenID));
  await redis.expire(roomScreenAvailable(roomID), EXPIRE_SECONDS);
}

export async function deregisterScreen(roomID: string, screenID: number) {
  await redis.sRem(roomScreenAvailable(roomID), String(screenID));
  await redis.publish(roomPubSub(roomID), "ping");
}
