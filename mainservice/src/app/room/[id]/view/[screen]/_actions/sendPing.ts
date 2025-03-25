"use server";
import screenPingObject from "@/db/objects/screenPing";

export async function sendPing(roomID: string, screenID: number) {
  await screenPingObject.ping(roomID, screenID);
}
