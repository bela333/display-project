"use server";

import roomCountObject from "@/db/objects/roomCount";
import roomModeObject from "@/db/objects/roomMode";
import roomRootObject from "@/db/objects/roomRoot";
import roomScreenCountObject from "@/db/objects/roomScreenCount";
import { keyToCode } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function createRoom() {
  const key = await roomCountObject.incr();

  const code = keyToCode(key).toLowerCase();

  await roomScreenCountObject.set(code, 0);
  await roomRootObject.touch(code);
  await roomModeObject.set(code, "calibration");

  redirect(`/room/${code}/config`);
}
