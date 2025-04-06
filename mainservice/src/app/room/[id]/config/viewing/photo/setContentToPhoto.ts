"use server";

import roomContentObject from "@/db/objects/roomContent";
import roomPhotosObject from "@/db/objects/roomPhotos";
import roomPubSubObject from "@/db/objects/roomPubSub";
import roomRootObject from "@/db/objects/roomRoot";
import { codeValidation } from "@/lib/utils";
import { z } from "zod";

export async function setContentToPhoto(room: string, photo: string) {
  const roomRes = await codeValidation().safeParseAsync(room);
  if (!roomRes.success) {
    return { ok: false, message: "Invalid room code" };
  }

  if (!(await roomRootObject.exists(roomRes.data))) {
    return { ok: false, message: "Room does not exist" };
  }

  const photoRes = await z.string().uuid().safeParseAsync(photo);
  if (!photoRes.success) {
    return;
  }

  const photoPath = await roomPhotosObject.photoPath.get(room, photo);

  if (!photoPath) {
    return;
  }

  await roomContentObject.type.set(room, "photo");
  await roomContentObject.url.set(room, photoPath);
  await roomPubSubObject.ping(room);
}
