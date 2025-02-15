"use server";
import { EXPIRE_SECONDS } from "@/lib/consts";
import redis from "@/lib/redis";
import { roomRoot, screenConfig } from "@/lib/redis-keys";
import { ScreenConfig } from "@/lib/screenconfig";

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
