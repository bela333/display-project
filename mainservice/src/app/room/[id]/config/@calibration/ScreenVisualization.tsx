"use client";
import { type SerializedScreen } from "@/app/db/_serialization";
import { Box, Text } from "@mantine/core";
import * as math from "mathjs";

export default function ScreenVisualization({
  screen,
  imageBounds,
  top,
  left,
}: {
  screen: SerializedScreen;
  imageBounds: [number, number];
  top?: number;
  left?: number;
}) {
  // Row major 2D affine transformation (3x3)
  const inputHomography = screen.homography ?? [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  // Column major 2D affine transformation (3x3)
  let homography = math.transpose(math.matrix(inputHomography));

  // Matrix representing screen size
  const screenSize = math.matrix([
    [imageBounds[0] ?? 1, 0, 0],
    [0, imageBounds[1] ?? 1, 0],
    [0, 0, 1],
  ]);
  const screenSizeInv = math.inv(screenSize);

  homography = math.multiply(screenSizeInv, homography, screenSize);

  // Column major 3D affine transformation (4x4)
  const matrix = math.matrix([
    [homography.get([0, 0]), homography.get([0, 1]), 0, homography.get([0, 2])],
    [homography.get([1, 0]), homography.get([1, 1]), 0, homography.get([1, 2])],
    [0, 0, homography.get([2, 2]), 0],
    [homography.get([2, 0]), homography.get([2, 1]), 0, homography.get([2, 2])],
  ] as const);

  //matrix = math.inv(matrix);
  console.log(screen.homography);

  return (
    <Box
      w="100%"
      h="100%"
      pos="relative"
      left={left}
      top={top}
      style={{
        backgroundColor: "rgb(0, 255, 0, 0.25)",

        transform: `matrix3d(${matrix.toArray().join(", ")})`,
        transformOrigin: "top left",
      }}
    >
      <Text p={8}>{screen.id}</Text>
    </Box>
  );
}
