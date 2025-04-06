"use client";
import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  SegmentedControl,
  Text,
} from "@mantine/core";
import roomContext from "../_contexts/roomContext";
import { use, useCallback, useEffect, useState } from "react";
import changeMode from "./changeMode";
import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import Link from "next/link";
import { type Modes } from "@/db/serialization";

export default function ConfigLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { id }: { id: string } = useParams();
  const room = use(roomContext);
  const segment = useSelectedLayoutSegment();
  const router = useRouter();
  useEffect(() => {
    if (!room?.lastEvent.mode) {
      return;
    }
    if (segment != room.lastEvent.mode) {
      switch (room.lastEvent.mode) {
        case "calibration":
          router.replace(`/room/${id}/config/calibration`);
          break;
        case "viewing":
          router.replace(`/room/${id}/config/viewing/photo`);
          break;
      }
    }
  }, [segment, room?.lastEvent.mode, router, id]);

  const [loading, setLoading] = useState(false);

  const onChange = useCallback(
    (mode: string) => {
      setLoading(true);
      void changeMode(id, mode as Modes).finally(() => setLoading(false));
    },
    [id]
  );

  if (room === undefined) {
    return;
  }

  return (
    <Flex direction="column" h="100vh">
      <LoadingOverlay visible={loading} />
      {/* Toolbar */}
      <Flex justify="space-between" direction="row" m={10} mt={0}>
        <Text>Room ID: {room.roomID}</Text>
        <SegmentedControl
          value={segment ?? undefined}
          onChange={onChange}
          data={[
            { value: "calibration", label: "Calibrate" },
            {
              value: "viewing",
              label: "Broadcast",
              disabled: room.lastEvent.image === undefined,
            },
          ]}
        />

        <Button component={Link} href={`/room/${id}/view`}>
          View
        </Button>
      </Flex>
      {children}
    </Flex>
  );
}
