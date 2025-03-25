"use server";
import roomPubSubObject from "@/db/objects/roomPubSub";
import screenConfigObject from "@/db/objects/screenConfig";
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

  await screenConfigObject.set(room, screen, config);
  await roomPubSubObject.ping(room);
}
