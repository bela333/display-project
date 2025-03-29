"use client";
import { Button, Divider, Stack, TextInput } from "@mantine/core";
import { useActionState } from "react";
import { CODE_LENGTH } from "@/lib/consts";
import { joinRoom } from "./_actions/joinRoom";
import { createRoom } from "./_actions/createRoom";

export function Onboard() {
  const [joinRoomState, joinRoomAction, joinPending] = useActionState(
    joinRoom,
    undefined
  );
  const [_state, createRoomAction, createPending] = useActionState(
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
