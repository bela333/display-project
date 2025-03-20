"use server";
import { type Modes } from "@/app/db/_serialization";
import redis from "@/app/db/redis";
import { roomMode, roomPubSub, roomRoot } from "@/app/db/redis-keys";
import { EXPIRE_SECONDS } from "@/lib/consts";

export default async function changeMode(room: string, mode: Modes) {
  if (!(await redis.get(roomRoot(room)))) {
    throw new Error("This room does not exist");
  }
  await redis.set(roomMode(room), mode, {
    EX: EXPIRE_SECONDS,
  });
  await redis.publish(roomPubSub(room), "ping");
}
