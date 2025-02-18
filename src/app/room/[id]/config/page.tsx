"use client";
import { Button, Center, Paper, Stack, Text, TextInput } from "@mantine/core";
import { use } from "react";
import { useParams } from "next/navigation";
import sendMessage from "./_actions/sendMessage";
import roomContext from "../_contexts/roomContext";
import Link from "next/link";
import changeMode from "./_actions/changeMode";

export default function Config() {
  const { id }: { id: string } = useParams();
  const room = use(roomContext);
  const mode = room?.lastEvent.mode ?? "calibration";
  return (
    <>
      <Stack>
        <Text>ID: {id}</Text>
        {room !== undefined ? (
          <Text>Last message: {JSON.stringify(room.lastEvent)}</Text>
        ) : null}
        <Center>
          <Paper maw="40rem" shadow="md" p="md" bg="orange">
            <form action={sendMessage}>
              <Text>Send a message:</Text>
              <TextInput mb="sm" name="message" />
              <input type="hidden" name="room" value={id} />
              <Button type="submit">Send</Button>
            </form>
          </Paper>
        </Center>
        <Button component={Link} href="view">
          View
        </Button>
        {mode === "calibration" ? (
          <Button color="green" onClick={() => changeMode(id, "viewing")}>
            Go live!
          </Button>
        ) : (
          <Button color="red" onClick={() => changeMode(id, "calibration")}>
            Return to configuration
          </Button>
        )}
      </Stack>
    </>
  );
}
