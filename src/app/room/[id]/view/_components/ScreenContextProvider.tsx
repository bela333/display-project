"use client";

import { useEffect, type ReactNode } from "react";
import { screenContext } from "../_contexts/screenContext";
import {
  deregisterScreen,
  registerScreen,
} from "../_actions/screenRegistration";

export default function ScreenContextProvider({
  roomID,
  screenID,
  children,
}: Readonly<{ roomID: string; screenID: number; children?: ReactNode }>) {
  useEffect(() => {
    void registerScreen(roomID, screenID);
    return () => void deregisterScreen(roomID, screenID);
  }, [roomID, screenID]);
  return (
    <screenContext.Provider value={{ screenID: screenID }}>
      {children}
    </screenContext.Provider>
  );
}
