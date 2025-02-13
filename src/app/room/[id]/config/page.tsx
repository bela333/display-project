"use client";
import { Button, Center, Paper, Text, TextInput } from "@mantine/core";
import { useContext } from "react";
import roomSubscriptionContext from "../_contexts/roomSubscriptionContext";
import { useParams } from "next/navigation";
import sendMessage from "./_sendMessage";

export default function Config() {
  const { id } = useParams();
  const roomContext = useContext(roomSubscriptionContext);
  return (
    <>
      <Text>ID: {id}</Text>
      {roomContext !== undefined ? (
        <Text>Last message: {roomContext.lastEvent}</Text>
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
    </>
  );
}
