"use client";
import { Box } from "@mantine/core";
import { use, useCallback, useState } from "react";

import * as math from "mathjs";
import { useElementSize } from "../../../../../useElementSize";
import roomContext from "../../../_contexts/roomContext";
import { screenContext } from "../_contexts/screenContext";
import { ScreenContent } from "../../../_screenContent/ScreenContent";

export default function ViewingPage() {
  const room = use(roomContext);
  const screen = use(screenContext);

  if (room === undefined || screen === undefined) {
    throw new Error("Unloaded");
  }

  const [screenBounds, setScreenBounds] = useState([1, 1]);
  const elementSizeCallback = useCallback(
    (bounds: DOMRectReadOnly) => setScreenBounds([bounds.width, bounds.height]),
    [setScreenBounds]
  );
  useElementSize(document.body, elementSizeCallback);

  const screenLocal = room.lastEvent.serializedScreens.find(
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
  const screenSizeInv = math.matrix([
    [1 / (screenBounds[0] ?? 1), 0, 0],
    [0, 1 / (screenBounds[1] ?? 1), 0],
    [0, 0, 1],
  ]);

  const makeWholeScreen = math.matrix([
    [(screenBounds[0] ?? 1) / (room.lastEvent.image?.width ?? 1), 0, 0],
    [0, (screenBounds[1] ?? 1) / (room.lastEvent.image?.height ?? 1), 0],
    [0, 0, 1],
  ]);

  homography = math.inv(homography);

  homography = math.multiply(
    makeWholeScreen,
    screenSizeInv,
    homography,
    screenSize
  );

  // Column major 3D affine transformation (4x4)
  const matrix = math.matrix([
    [homography.get([0, 0]), homography.get([0, 1]), 0, homography.get([0, 2])],
    [homography.get([1, 0]), homography.get([1, 1]), 0, homography.get([1, 2])],
    [0, 0, homography.get([2, 2]), 0],
    [homography.get([2, 0]), homography.get([2, 1]), 0, homography.get([2, 2])],
  ] as const);

  return (
    <Box w="100dvw" h="100dvh" style={{ overflow: "hidden" }}>
      <Box
        style={{
          width: room.lastEvent.image?.width,
          height: room.lastEvent.image?.height,
          transform: `matrix3d(${matrix.toArray().join(", ")})`,
          transformOrigin: "top left",
        }}
      >
        <ScreenContent />
      </Box>
    </Box>
  );
}
