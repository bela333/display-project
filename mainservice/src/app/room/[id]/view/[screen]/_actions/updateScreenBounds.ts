"use server";
import redis from "@/db/redis";
import { roomRoot, screenConfig } from "@/db/redis-keys";
import { EXPIRE_SECONDS } from "@/lib/consts";
import { type ScreenConfig } from "@/lib/screenConfig";

export async function updateScreenBounds(
  room: string,
  screen: number,
  {
    height,
    width,
    x,
    y,
  }: {
    width: number;
    height: number;
    x: number;
    y: number;
  }
) {
  const config: ScreenConfig = {
    width,
    height,
    x,
    y,
  };

  await redis.set(screenConfig(room, screen), JSON.stringify(config), {
    EX: EXPIRE_SECONDS,
  });
  await redis.publish(roomRoot(room), "ping");
}
