import roomContentObject from "@/db/objects/roomContent";
import roomPubSubObject from "@/db/objects/roomPubSub";
import { ACCEPTED_THIRD_PARTY_VIDEO } from "@/lib/consts";
import { codeValidation } from "@/lib/utils";
import { Button, Stack, TextInput } from "@mantine/core";
import { z } from "zod";

async function playUrlAction(formData: FormData) {
  "use server";
  const room = formData.get("room");
  const url = formData.get("url");
  const roomRes = await codeValidation().safeParseAsync(room);
  const urlRes = await z
    .string()
    .url()
    .refine((val) => ACCEPTED_THIRD_PARTY_VIDEO.includes(new URL(val).origin), {
      message: "Non-supported URL",
    })
    .safeParseAsync(url);
  if (!roomRes.success || !urlRes.success) {
    return;
  }
  await roomContentObject.type.set(roomRes.data, "video");
  await roomContentObject.url.set(roomRes.data, urlRes.data);
  await roomContentObject.status.type.set(roomRes.data, "paused");
  await roomContentObject.status.videotime.set(roomRes.data, 0);
  await roomContentObject.status.timestamp.set(roomRes.data, Date.now());

  await roomPubSubObject.ping(roomRes.data);
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <form action={playUrlAction}>
      <Stack>
        <input type="hidden" name="room" value={id} />
        <TextInput label="Embed url" name="url" />
        <Button type="submit">Play</Button>
      </Stack>
    </form>
  );
}
