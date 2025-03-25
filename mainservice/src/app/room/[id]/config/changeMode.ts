"use server";

import { type Modes } from "@/db/_serialization";
import roomModeObject from "@/db/objects/roomMode";
import roomPubSubObject from "@/db/objects/roomPubSub";
import roomRootObject from "@/db/objects/roomRoot";

export default async function changeMode(room: string, mode: Modes) {
  if (!(await roomRootObject.exists(room))) {
    throw new Error("This room does not exist");
  }
  await roomModeObject.set(room, mode);
  await roomPubSubObject.ping(room);
}
