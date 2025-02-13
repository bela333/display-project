"use client";
import { type inferAsyncIterableYield } from "@trpc/server/unstable-core-do-not-import";
import { createContext } from "react";
import { type AppRouter } from "@/server/api/root";

export type RoomSubscriptionContextType = {
  lastEvent: inferAsyncIterableYield<
    inferAsyncIterableYield<
      AppRouter["room"]["roomEvents"]["_def"]["$types"]["output"]
    >
  >;
};

const roomSubscriptionContext = createContext<
  RoomSubscriptionContextType | undefined
>(undefined);

export default roomSubscriptionContext;
