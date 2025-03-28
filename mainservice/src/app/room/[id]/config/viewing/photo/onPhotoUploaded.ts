"use server";

import roomContentObject from "@/db/objects/roomContent";
import roomPhotosObject from "@/db/objects/roomPhotos";
import roomPubSubObject from "@/db/objects/roomPubSub";
import { codeValidation } from "@/lib/utils";
import { z } from "zod";

export async function onPhotoUploaded(room: string, photoID: string) {
  const roomRes = await codeValidation().safeParseAsync(room);
  if (!roomRes.success) {
    return;
  }
  const photoIDRes = await z.string().uuid().safeParseAsync(photoID);
  if (!photoIDRes.success) {
    return;
  }

  await roomPhotosObject.photosSet.add(room, photoIDRes.data);

  await roomPubSubObject.ping(roomRes.data);
}
