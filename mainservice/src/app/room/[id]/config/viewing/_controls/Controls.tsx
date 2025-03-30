"use client";
import { use } from "react";
import roomContext from "../../../_contexts/roomContext";
import Video from "./Video";

export default function Controls() {
  const room = use(roomContext);
  switch (room?.lastEvent.nowPlayingContent.type) {
    case "video":
      return <Video content={room.lastEvent.nowPlayingContent} />;
    default:
      return "No controls";
  }
}
