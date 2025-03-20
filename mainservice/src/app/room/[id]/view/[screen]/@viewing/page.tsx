"use client";
import { Box } from "@mantine/core";
import { use, useState } from "react";

import * as math from "mathjs";
import { useElementSize } from "../../../../../useElementSize";
import roomContext from "../../../_contexts/roomContext";
import { screenContext } from "../_contexts/screenContext";

export default function ViewingPage() {
  const room = use(roomContext);
  const screen = use(screenContext);

  if (room === undefined || screen === undefined) {
    throw new Error("Unloaded");
  }

  const [screenBounds, setScreenBounds] = useState([1, 1]);
  useElementSize(document.body, (bounds) =>
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
