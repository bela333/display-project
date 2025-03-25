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
import { use, useCallback, useState } from "react";
import changeMode from "./changeMode";
import { useParams } from "next/navigation";
import Link from "next/link";
import { type Modes } from "@/db/_serialization";

export default function ConfigLayout({
  calibration,
  viewing,
}: Readonly<{ calibration: React.ReactNode; viewing: React.ReactNode }>) {
  const { id }: { id: string } = useParams();
  const room = use(roomContext);

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
    <Flex direction="column">
      <LoadingOverlay visible={loading} />
      {/* Toolbar */}
      <Flex justify="space-between" direction="row" m={10} mt={0}>
        <Text>Room ID: {room.roomID}</Text>
        <SegmentedControl
          value={room.lastEvent.mode}
          onChange={onChange}
          data={[
            { value: "calibration", label: "Calibrate" },
            { value: "viewing", label: "Broadcast" },
          ]}
        />
        <Button component={Link} href={`/room/${id}/view`}>
          View
        </Button>
      </Flex>
      <Box>
        {room.lastEvent.mode === "calibration"
          ? calibration
          : room.lastEvent.mode === "viewing"
          ? viewing
          : null}
      </Box>
    </Flex>
  );
}
