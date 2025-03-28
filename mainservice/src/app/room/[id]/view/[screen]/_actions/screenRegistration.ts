"use server";
import roomScreenAvailableObject from "@/db/objects/roomScreenAvailable";

export async function registerScreen(roomID: string, screenID: number) {
  await roomScreenAvailableObject.add(roomID, screenID);
}

export async function deregisterScreen(roomID: string, screenID: number) {
  // NoOp
}
