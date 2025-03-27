"use client";
import {
  Box,
  Flex,
  SegmentedControl,
  type SegmentedControlItem,
} from "@mantine/core";
import React, { useState } from "react";
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
    <Flex w="100%" px="4rem">
      <Box w="6rem">
        <SegmentedControl
          value={segment}
          onChange={(value) => router.replace(value)}
          orientation="vertical"
          data={routes}
          fullWidth
        />
      </Box>
      <Box w="50%">{children}</Box>
      <Box w="50%">
        <PreviewWindow />
      </Box>
    </Flex>
  );
}
