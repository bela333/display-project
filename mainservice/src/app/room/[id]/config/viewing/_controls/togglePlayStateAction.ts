"use server";
import roomContentObject from "@/db/objects/roomContent";
import roomPubSubObject from "@/db/objects/roomPubSub";
import { codeValidation } from "@/lib/utils";

export async function togglePlayStateAction(room: string) {
  const roomRes = await codeValidation().safeParseAsync(room);
  if (!roomRes.success) {
    return;
  }
  const type = await roomContentObject.type.get(room);
  if (type !== "video") {
    return;
  }
  const status = await roomContentObject.status.type.get(room);
  const timestamp = await roomContentObject.status.timestamp.get(room);
  const videotime = await roomContentObject.status.videotime.get(room);

  if (status === null || timestamp === null || videotime === null) {
    return;
  }

  if (status === "paused") {
    // Paused
    await roomContentObject.status.type.set(room, "playing");
    await roomContentObject.status.timestamp.set(room, Date.now());
    await roomContentObject.status.videotime.set(room, videotime);
  } else {
    // Playing
    const elapsed = Date.now() - timestamp;
    await roomContentObject.status.type.set(room, "paused");
    await roomContentObject.status.timestamp.set(room, Date.now());
    await roomContentObject.status.videotime.set(
      room,
      videotime + elapsed / 1000
    );
  }

  await roomPubSubObject.ping(room);
}
