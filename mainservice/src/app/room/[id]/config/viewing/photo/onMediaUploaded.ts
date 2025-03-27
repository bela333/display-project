"use server";

import roomContentObject from "@/db/objects/roomContent";
import roomPubSubObject from "@/db/objects/roomPubSub";
import { codeValidation } from "@/lib/utils";

export async function onMediaUploaded(room: string, filename: string) {
  const roomRes = await codeValidation().safeParseAsync(room);

  if (!roomRes.success) {
    return;
  }
  await roomContentObject.type.set(room, "image");
  await roomContentObject.filename.set(room, filename);

  await roomPubSubObject.ping(roomRes.data);
}
