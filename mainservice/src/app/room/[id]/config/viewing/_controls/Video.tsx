"use client";
import { type SerializedEmbeddedVideoContent } from "@/db/serialization";
import { Button } from "@mantine/core";
import { togglePlayStateAction } from "./togglePlayStateAction";
import { useCallback } from "react";
import { useParams } from "next/navigation";

export type Props = {
  content: SerializedEmbeddedVideoContent;
};

export default function Video({ content }: Props) {
  const { id: room } = useParams<{ id: string }>();
  const toggle = useCallback(() => {
    void togglePlayStateAction(room);
  }, [room]);
  return (
    <div>
      <Button onClick={toggle}>
        {content.status.type === "paused" ? "Play" : "Pause"}
      </Button>
    </div>
  );
}
