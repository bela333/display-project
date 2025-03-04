"use client";
import { type inferAsyncIterableYield } from "@trpc/server/unstable-core-do-not-import";
import { createContext } from "react";
import { type AppRouter } from "@/server/api/root";

export type RoomContextType = {
  lastEvent: inferAsyncIterableYield<
    inferAsyncIterableYield<
      AppRouter["room"]["roomEvents"]["_def"]["$types"]["output"]
    >
  >;
  roomID: string;
};

const roomContext = createContext<RoomContextType | undefined>(undefined);

export default roomContext;
