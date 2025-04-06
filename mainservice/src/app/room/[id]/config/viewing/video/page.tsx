"use client";
import { Button, Stack, TextInput } from "@mantine/core";
import { useParams } from "next/navigation";
import { playUrlAction as playUrl } from "./playUrlAction";

import { useCallback } from "react";
import { notifications } from "@mantine/notifications";
export default function VideoPage() {
  const { id: room } = useParams<{ id: string }>();
  const playUrlAction = useCallback(async (form: FormData) => {
    const res = await playUrl(form);
    if (!res.ok) {
      notifications.show({
        message: Array.isArray(res.message)
          ? res.message.join(", ")
          : res.message,
        color: "red",
      });
    }
  }, []);
  return (
    <form action={playUrlAction}>
      <Stack>
        <input type="hidden" name="room" value={room} />
        <TextInput label="Embed url" name="url" />
        <Button type="submit">Play</Button>
      </Stack>
    </form>
  );
}
