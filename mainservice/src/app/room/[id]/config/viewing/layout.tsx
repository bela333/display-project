"use client";
import {
  Box,
  Flex,
  SegmentedControl,
  useMatches,
  type SegmentedControlItem,
} from "@mantine/core";
import React from "react";
import PreviewWindow from "./PreviewWindow";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import style from "./style.module.css";

const routes: SegmentedControlItem[] = [
  {
    label: "Photos",
    value: "photo",
  },
  {
    label: "Videos",
    value: "video",
  },

  {
    label: "IFrame",
    value: "iframe",
  },
];

export default function ViewingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment() ?? undefined;
  const router = useRouter();

  const segmentedControlOrientation = useMatches({
    base: "horizontal" as const,
    sm: "vertical" as const,
  });

  return (
    <Flex
      w="100%"
      direction={{ base: "column", sm: "row" }}
      className={style.container}
    >
      <Box w={{ sm: "6rem" }}>
        <SegmentedControl
          value={segment}
          onChange={(value) => router.replace(value)}
          orientation={segmentedControlOrientation}
          data={routes}
          fullWidth
        />
      </Box>
      <Box className={style.splitContainers} px="1rem">
        {children}
      </Box>
      <Box className={style.splitContainers}>
        <PreviewWindow />
      </Box>
    </Flex>
  );
}
