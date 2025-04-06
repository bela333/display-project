"use server";
import roomContentObject from "@/db/objects/roomContent";
import roomPubSubObject from "@/db/objects/roomPubSub";
import roomRootObject from "@/db/objects/roomRoot";
import { ACCEPTED_THIRD_PARTY_VIDEO } from "@/lib/consts";
import { codeValidation } from "@/lib/utils";
import { z } from "zod";

export async function playUrlAction(formData: FormData) {
  const room = formData.get("room");
  const url = formData.get("url");
  const roomRes = await codeValidation().safeParseAsync(room);
  if (!roomRes.success) {
    return { ok: false, message: "Invalid room code" };
  }

  if (!(await roomRootObject.exists(roomRes.data))) {
    return { ok: false, message: "Room does not exist" };
  }
  const urlRes = await z
    .string()
    .url()
    .refine(
      (val) => {
        try {
          return ACCEPTED_THIRD_PARTY_VIDEO.includes(new URL(val).host);
        } catch {
          return true;
        }
      },
      {
        message: "Unsupported URL",
      }
    )
    .safeParseAsync(url);
  if (!urlRes.success) {
    return { ok: false as const, message: urlRes.error.flatten().formErrors };
  }
  await roomContentObject.type.set(roomRes.data, "video");
  await roomContentObject.url.set(roomRes.data, urlRes.data);
  await roomContentObject.status.type.set(roomRes.data, "paused");
  await roomContentObject.status.videotime.set(roomRes.data, 0);
  await roomContentObject.status.timestamp.set(roomRes.data, Date.now());

  await roomPubSubObject.ping(roomRes.data);
  return { ok: true as const };
}
