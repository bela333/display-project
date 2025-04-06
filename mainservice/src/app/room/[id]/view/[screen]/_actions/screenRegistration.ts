"use server";
import roomRootObject from "@/db/objects/roomRoot";
import roomScreenAvailableObject from "@/db/objects/roomScreenAvailable";
import { codeValidation } from "@/lib/utils";

export async function registerScreen(roomID: string, screenID: number) {
  const roomRes = await codeValidation().safeParseAsync(roomID);
  if (!roomRes.success) {
    throw new Error("Invalid room code");
  }

  if (!(await roomRootObject.exists(roomRes.data))) {
    throw new Error("Room does not exist");
  }
  await roomScreenAvailableObject.add(roomID, screenID);
}

export async function deregisterScreen(_roomID: string, _screenID: number) {
  // NoOp
}
