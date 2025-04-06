"use server";

import roomPhotosObject from "@/db/objects/roomPhotos";
import roomPubSubObject from "@/db/objects/roomPubSub";
import roomRootObject from "@/db/objects/roomRoot";
import { codeValidation } from "@/lib/utils";
import { z } from "zod";

export async function onPhotoUploaded(room: string, photoID: string) {
  const roomRes = await codeValidation().safeParseAsync(room);
  if (!roomRes.success) {
    return { ok: false, message: "Invalid room code" };
  }

  if (!(await roomRootObject.exists(roomRes.data))) {
    return { ok: false, message: "Room does not exist" };
  }
  const photoIDRes = await z.string().uuid().safeParseAsync(photoID);
  if (!photoIDRes.success) {
    return { ok: false as const, message: "Error with uploaded file" };
  }

  await roomPhotosObject.photosSet.add(room, photoIDRes.data);

  await roomPubSubObject.ping(roomRes.data);

  return { ok: true as const };
}
