"use client";

import { api } from "@/trpc/react";
import { type ReactNode } from "react";
import roomContext from "../_contexts/roomContext";

export default function RoomContextProvider({
  children,
  room,
}: Readonly<{ children?: ReactNode; room: string }>) {
  const subscription = api.room.roomEvents.useSubscription({ room });
  //TODO: Suspend until it loads
  if (subscription.status === "connecting") {
    return "Connecting...";
  }
  if (subscription.status === "error") {
    return "Error!";
  }

  return (
    <roomContext.Provider
      value={{ lastEvent: subscription.data, roomID: room }}
    >
      {children}
    </roomContext.Provider>
  );
}
