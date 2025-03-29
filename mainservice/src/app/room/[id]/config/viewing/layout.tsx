"use client";
import {
  Box,
  Flex,
  SegmentedControl,
  type SegmentedControlItem,
} from "@mantine/core";
import React from "react";
import PreviewWindow from "./PreviewWindow";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";

const routes: SegmentedControlItem[] = [
  {
    label: "Photos",
    value: "photo",
  },
  {
    label: "Videos",
    value: "video",
  },
];

export default function ViewingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment() ?? undefined;
  const router = useRouter();

  return (
    <Flex w="100%">
      <Box w="6rem">
        <SegmentedControl
          value={segment}
          onChange={(value) => router.replace(value)}
          orientation="vertical"
          data={routes}
          fullWidth
        />
      </Box>
      <Box w="50%" px="1rem">
        {children}
      </Box>
      <Box w="50%">
        <PreviewWindow />
      </Box>
    </Flex>
  );
}
