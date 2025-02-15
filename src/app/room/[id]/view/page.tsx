"use client";
import { Box, Flex, Text } from "@mantine/core";
import { use, useEffect, useState } from "react";
import { screenContext } from "./_contexts/screenContext";
import roomContext from "../_contexts/roomContext";
import Image from "next/image";
import { useDebouncedCallback } from "@mantine/hooks";
import { updateScreenBounds } from "./_actions/updateScreenBounds";

export default function ViewPage() {
  const room = use(roomContext);
  const screen = use(screenContext);

  const roomID = room?.roomID;
  const screenID = screen?.screenID;

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

  if (!room || !screen) {
    return;
  }

  const tagID = String(screen?.screenID).padStart(5, "0");
  return (
    <Flex direction="row">
      <Box w="50vw" h="100vh" style={{ overflow: "auto" }}>
        <Text>
          {room?.roomID}:{screen?.screenID}
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
