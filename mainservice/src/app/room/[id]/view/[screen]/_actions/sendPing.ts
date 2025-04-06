"use server";
import roomRootObject from "@/db/objects/roomRoot";
import screenPingObject from "@/db/objects/screenPing";
import { codeValidation } from "@/lib/utils";

export async function sendPing(roomID: string, screenID: number) {
  const roomRes = await codeValidation().safeParseAsync(roomID);
  if (!roomRes.success) {
    throw new Error("Invalid room code");
  }

  if (!(await roomRootObject.exists(roomRes.data))) {
    throw new Error("Room does not exist");
  }
  await screenPingObject.ping(roomID, screenID);
}
