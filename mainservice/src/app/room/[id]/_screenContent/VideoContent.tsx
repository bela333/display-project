"use client";

import { type SerializedEmbeddedVideoContent } from "@/db/serialization";
import { Box } from "@mantine/core";
import { use, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import roomContext from "../_contexts/roomContext";

export type Props = {
  content: SerializedEmbeddedVideoContent;
};

export default function VideoContent({ content }: Props) {
  const room = use(roomContext);
  if (room === undefined) {
    throw new Error("Loading...");
  }
  const [video, setVideo] = useState<ReactPlayer | null>(null);
  useEffect(() => {
    if (!video) {
      return;
    }
    if (content.status.type === "playing") {
      // playing
      video.seekTo(content.status.videotime);
    } else {
      // paused
      video.seekTo(content.status.videotime);
    }
  }, [
    video,
    content.status.timestamp,
    content.status.videotime,
    content.status.type,
  ]);

  console.log(
    content.status.timestamp,
    content.status.videotime,
    content.status.type
  );

  return (
    <ReactPlayer
      ref={setVideo}
      url={content.url}
      width={room.lastEvent.image?.width}
      height={room.lastEvent.image?.height}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
      }}
      muted
      playing={content.status.type === "playing"}
    />
  );
}
