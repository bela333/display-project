"use server";
import redis from "@/lib/redis";
import { roomPubSub } from "@/lib/redis-keys";

export default async function sendMessage(form: FormData) {
  const message = form.get("message");
  const room = form.get("room");
  if (message === null || message instanceof File) {
    return;
  }
  if (room === null || room instanceof File) {
    return;
  }
  await redis.publish(roomPubSub(room), message);
}
