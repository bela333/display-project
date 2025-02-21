/* eslint-disable @next/next/no-img-element */
"use client";
import { Box, Flex, Text } from "@mantine/core";
import { use, useEffect, useState } from "react";
import {
  screenContext,
  type ScreenContextType,
} from "./_contexts/screenContext";
import roomContext, { type RoomContextType } from "../_contexts/roomContext";
import Image from "next/image";
import { useDebouncedCallback } from "@mantine/hooks";
import { updateScreenBounds } from "./_actions/updateScreenBounds";

function ViewingPage({
  room,
  screen,
}: Readonly<{ room: RoomContextType; screen: ScreenContextType }>) {
  return (
    <Box w="100dvw" h="100dvh" style={{ overflow: "hidden" }}>
      <img
        style={{
          width: "100dvw",
          height: "100dvh",
          transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1)",
          transformOrigin: "bottom left",
        }}
        alt="AprilTag"
        src="https://upload.wikimedia.org/wikipedia/commons/c/c4/PM5544_with_non-PAL_signals.png"
      ></img>
    </Box>
  );
}

function CalibrationPage({
  room,
  screen,
}: Readonly<{ room: RoomContextType; screen: ScreenContextType }>) {
  const roomID = room.roomID;
  const screenID = screen.screenID;

  const setBounds = useDebouncedCallback(
    async (roomID: string, screenID: number, rect: DOMRectReadOnly) => {
      await updateScreenBounds(roomID, screenID, {
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
      });
    },
    1000
  );

  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageRef || !roomID || !screenID) {
      return;
    }

    const observer = new ResizeObserver((entry) => {
      const rect = entry[0]?.contentRect;
      if (rect) {
        setBounds(roomID, screenID, rect);
      }
    });

    observer.observe(imageRef);
    return () => {
      observer.unobserve(imageRef);
    };
  }, [imageRef, roomID, screenID, setBounds]);

  const tagID = String(screen.screenID).padStart(5, "0");
  return (
    <Flex direction="row">
      <Box w="50vw" h="100vh" style={{ overflow: "auto" }}>
        <Text>
          {room.roomID}:{screen.screenID}
        </Text>
      </Box>
      <Box w="50vw" h="100vh" style={{ position: "relative" }}>
        <Image
          ref={setImageRef}
          src={`/tags/tag${tagID}.svg`}
          alt="AprilTag"
          fill
        ></Image>
      </Box>
    </Flex>
  );
}

export default function ViewPage() {
  const room = use(roomContext);
  const screen = use(screenContext);

  if (!room || !screen) {
    return;
  }

  return room.lastEvent.mode === "calibration" ? (
    <CalibrationPage room={room} screen={screen} />
  ) : (
    <ViewingPage room={room} screen={screen} />
  );
}
