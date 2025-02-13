"use client";

import { api } from "@/trpc/react";
import { type ReactNode } from "react";
import roomSubscriptionContext from "../_contexts/roomSubscriptionContext";

export default function RoomSubscriptionProvider({
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
    <roomSubscriptionContext.Provider value={{ lastEvent: subscription.data }}>
      {children}
    </roomSubscriptionContext.Provider>
  );
}
