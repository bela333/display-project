"use server";
import roomPubSubObject from "@/db/objects/roomPubSub";
import roomRootObject from "@/db/objects/roomRoot";
import screenConfigObject from "@/db/objects/screenConfig";
import { type ScreenConfig } from "@/lib/screenConfig";
import { codeValidation } from "@/lib/utils";

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
  const roomRes = await codeValidation().safeParseAsync(room);
  if (!roomRes.success) {
    throw new Error("Invalid room code");
  }

  if (!(await roomRootObject.exists(roomRes.data))) {
    throw new Error("Room does not exist");
  }

  const config: ScreenConfig = {
    width,
    height,
    x,
    y,
  };

  await screenConfigObject.set(room, screen, config);
  await roomPubSubObject.ping(room);
}
