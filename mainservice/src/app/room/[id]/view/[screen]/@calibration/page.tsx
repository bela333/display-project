"use client";
import { useDebouncedCallback } from "@mantine/hooks";
import roomContext from "../../../_contexts/roomContext";
import { screenContext } from "../_contexts/screenContext";
import { updateScreenBounds } from "../_actions/updateScreenBounds";
import { use, useState } from "react";
import { Box, Flex, Text } from "@mantine/core";
import Image from "next/image";
import { useElementSize } from "@/app/useElementSize";

export default function CalibrationPage() {
  const room = use(roomContext);
  const screen = use(screenContext);

  if (room === undefined || screen === undefined) {
    throw new Error("Unloaded");
  }

  const roomID = room.roomID;
  const screenID = screen.screenID;

  const setBounds = useDebouncedCallback(async (rect: DOMRectReadOnly) => {
    await updateScreenBounds(roomID, screenID, {
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y,
    });
  }, 1000);

  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useElementSize(imageRef, setBounds);

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
