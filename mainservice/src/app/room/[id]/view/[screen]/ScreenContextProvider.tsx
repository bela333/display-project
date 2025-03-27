"use client";

import { useEffect, type ReactNode } from "react";
import { screenContext } from "./_contexts/screenContext";
import {
  deregisterScreen,
  registerScreen,
} from "./_actions/screenRegistration";
import { PING_INTERVAL } from "@/lib/consts";
import { sendPing } from "./_actions/sendPing";

const useRoomRegistry = (roomID: string, screenID: number) =>
  useEffect(() => {
    void registerScreen(roomID, screenID);
    return () => void deregisterScreen(roomID, screenID);
  }, [roomID, screenID]);

const usePing = (roomID: string, screenID: number) =>
  useEffect(() => {
    void sendPing(roomID, screenID);
    const handle = setInterval(() => {
      void sendPing(roomID, screenID);
    }, PING_INTERVAL * 1000);
    return () => clearInterval(handle);
  }, [roomID, screenID]);

export default function ScreenContextProvider({
  roomID,
  screenID,
  children,
}: Readonly<{ roomID: string; screenID: number; children?: ReactNode }>) {
  useRoomRegistry(roomID, screenID);
  usePing(roomID, screenID);

  return (
    <screenContext.Provider value={{ screenID: screenID }}>
      {children}
    </screenContext.Provider>
  );
}
