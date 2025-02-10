"use client";
import { Button, Divider, Stack, TextInput } from "@mantine/core";
import { useActionState } from "react";
import { join } from "./join";

export function Onboard() {
  const [state, formAction, joinPending] = useActionState(join, undefined);

  const newRoomPending = false;

  const pending = joinPending || newRoomPending;

  return (
    <Stack>
      <form action={formAction}>
        <Stack>
          <TextInput
            name="code"
            error={state?.errors.code}
            placeholder="Room code"
            autoComplete="off"
            autoCapitalize="off"
            maxLength={6}
          />
          <Button type="submit" loading={pending}>
            Join
          </Button>
        </Stack>
      </form>
      <Divider />
      <Button variant="light" loading={pending}>
        New room
      </Button>
    </Stack>
  );
}
