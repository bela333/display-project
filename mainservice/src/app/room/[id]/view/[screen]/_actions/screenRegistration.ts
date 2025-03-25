"use server";
import roomPubSubObject from "@/db/objects/roomPubSub";
import roomScreenAvailableObject from "@/db/objects/roomScreenAvailable";

export async function registerScreen(roomID: string, screenID: number) {
  await roomScreenAvailableObject.add(roomID, screenID);
}

export async function deregisterScreen(roomID: string, screenID: number) {
  await roomScreenAvailableObject.rem(roomID, screenID);
  await roomPubSubObject.ping(roomID);
}
