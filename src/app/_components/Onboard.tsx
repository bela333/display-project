"use client";
import { Button, Divider, Stack, TextInput } from "@mantine/core";
import { useActionState } from "react";
import { joinRoom } from "./joinRoom";
import { createRoom } from "./createRoom";
import { CODE_LENGTH } from "@/lib/consts";

export function Onboard() {
  const [joinRoomState, joinRoomAction, joinPending] = useActionState(
    joinRoom,
    undefined
  );
  const [createRoomState, createRoomAction, createPending] = useActionState(
    createRoom,
    undefined
  );

  const pending = joinPending || createPending;

  return (
    <Stack>
      <form action={joinRoomAction}>
        <Stack>
          <TextInput
            name="code"
            error={joinRoomState?.errors?.code}
            placeholder="Room code"
            autoComplete="off"
            autoCapitalize="off"
            maxLength={CODE_LENGTH}
            styles={{
              input: {
                textTransform: "uppercase",
              },
            }}
          />
          <Button type="submit" loading={pending}>
            Join
          </Button>
        </Stack>
      </form>
      <Divider />
      <form action={createRoomAction}>
        <Stack>
          <Button variant="light" loading={pending} type="submit">
            New room
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
