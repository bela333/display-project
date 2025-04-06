"use client";

import { api } from "@/trpc/react";
import { type ReactNode } from "react";
import roomContext from "./room/[id]/_contexts/roomContext";
import { Flex, Loader } from "@mantine/core";

export default function RoomContextProvider({
  children,
  room,
}: Readonly<{ children?: ReactNode; room: string }>) {
  const subscription = api.room.roomEvents.useSubscription({ room });
  if (subscription.status === "connecting" || subscription.data === undefined) {
    return (
      <Flex w="100vw" h="100vh" justify="center" align="center">
        <Loader />
      </Flex>
    );
  }
  if (subscription.status === "error") {
    return `Error: ${subscription.error.message}`;
  }

  return (
    <roomContext.Provider
      value={{ lastEvent: subscription.data, roomID: room }}
    >
      {children}
    </roomContext.Provider>
  );
}
