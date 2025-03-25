"use client";

import { type ReactNode, use } from "react";
import roomContext from "../../_contexts/roomContext";
import { screenContext } from "./_contexts/screenContext";

export function Switcher({
  calibration,
  viewing,
}: {
  calibration: ReactNode;
  viewing: ReactNode;
}) {
  const room = use(roomContext);
  const screen = use(screenContext);

  if (room === undefined || screen === undefined) {
    throw new Error("Loading...");
  }

  switch (room.lastEvent.mode) {
    case "calibration":
      return calibration;
    case "viewing":
      return viewing;
  }
  return <></>;
}
