"use client";
import { Button, Center, Paper, Stack, Text, TextInput } from "@mantine/core";
import { use } from "react";
import { useParams } from "next/navigation";
import sendMessage from "./_sendMessage";
import roomContext from "../_contexts/roomContext";
import Link from "next/link";

export default function Config() {
  const { id } = useParams();
  const room = use(roomContext);
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
      </Stack>
    </>
  );
}
