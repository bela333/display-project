/* eslint-disable @next/next/no-img-element */
"use client";
import { Box, Flex, Text } from "@mantine/core";
import { use, useEffect, useState } from "react";
import {
  screenContext,
  type ScreenContextType,
} from "./_contexts/screenContext";
import Image from "next/image";
import { useDebouncedCallback } from "@mantine/hooks";
import { updateScreenBounds } from "./_actions/updateScreenBounds";
import * as math from "mathjs";
import roomContext, { type RoomContextType } from "../../_contexts/roomContext";

function ViewingPage({
  room,
  screen,
}: Readonly<{ room: RoomContextType; screen: ScreenContextType }>) {
  const [screenBounds, setScreenBounds] = useState([1, 1]);
  useElementSize(document.body, room.roomID, screen.screenID, (r, s, bounds) =>
    setScreenBounds([bounds.width, bounds.height])
  );

  const screenLocal = room.lastEvent.screenLocals.find(
    (local) => local.id === String(screen.screenID)
  );

  // Row major 2D affine transformation (3x3)
  const inputHomography = screenLocal?.homography ?? [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  // Column major 2D affine transformation (3x3)
  let homography = math.transpose(math.matrix(inputHomography));

  // Matrix representing screen size
  const screenSize = math.matrix([
    [screenBounds[0] ?? 1, 0, 0],
    [0, screenBounds[1] ?? 1, 0],
    [0, 0, 1],
  ]);
  const screenSizeInv = math.inv(screenSize);

  homography = math.multiply(screenSizeInv, homography, screenSize);

  // Column major 3D affine transformation (4x4)
  let matrix = math.matrix([
    [homography.get([0, 0]), homography.get([0, 1]), 0, homography.get([0, 2])],
    [homography.get([1, 0]), homography.get([1, 1]), 0, homography.get([1, 2])],
    [0, 0, homography.get([2, 2]), 0],
    [homography.get([2, 0]), homography.get([2, 1]), 0, homography.get([2, 2])],
  ] as const);

  matrix = math.inv(matrix);

  return (
    <Box w="100dvw" h="100dvh" style={{ overflow: "hidden" }}>
      <img
        style={{
          width: "100dvw",
          height: "100dvh",
          transform: `matrix3d(${matrix.toArray().join(", ")})`,
          transformOrigin: "top left",
        }}
        alt="AprilTag"
        src="https://upload.wikimedia.org/wikipedia/commons/c/c4/PM5544_with_non-PAL_signals.png"
      ></img>
    </Box>
  );
}

function useElementSize(
  imageRef: HTMLElement | null,
  roomID: string,
  screenID: number,
  setBounds: (
    roomID: string,
    screenID: number,
    rect: DOMRectReadOnly
  ) => unknown
) {
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

  useElementSize(imageRef, roomID, screenID, setBounds);

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
