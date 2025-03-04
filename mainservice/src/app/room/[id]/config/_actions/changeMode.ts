"use server";
import { Modes } from "@/app/db/_serialization";
import redis from "@/app/db/redis";
import { roomMode, roomPubSub, roomRoot } from "@/app/db/redis-keys";

export default async function changeMode(room: string, mode: Modes) {
  if (!(await redis.get(roomRoot(room)))) {
    throw new Error("This room does not exist");
  }
  await redis.set(roomMode(room), mode);
  await redis.publish(roomPubSub(room), "ping");
}
