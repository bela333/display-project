import roomContentObject from "@/db/objects/roomContent";
import roomPubSubObject from "@/db/objects/roomPubSub";
import roomRootObject from "@/db/objects/roomRoot";
import { codeValidation } from "@/lib/utils";
import { Button, Stack, TextInput } from "@mantine/core";
import { z } from "zod";

async function playUrlAction(formData: FormData) {
  "use server";
  const room = formData.get("room");
  const url = formData.get("url");
  const roomRes = await codeValidation().safeParseAsync(room);
  const urlRes = await z.string().url().safeParseAsync(url);
  if (!roomRes.success || !urlRes.success) {
    return;
  }
  if (!(await roomRootObject.exists(roomRes.data))) {
    return;
  }
  await roomContentObject.type.set(roomRes.data, "iframe");
  await roomContentObject.url.set(roomRes.data, urlRes.data);

  await roomPubSubObject.ping(roomRes.data);
}

export default async function IFramePage({
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
