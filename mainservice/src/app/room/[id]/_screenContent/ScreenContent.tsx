import { useContext } from "react";
import roomContext from "../_contexts/roomContext";
import { Image } from "@mantine/core";
import VideoContent from "./VideoContent";

export function ScreenContent() {
  const room = useContext(roomContext);

  if (room === undefined) {
    return;
  }

  return (
    <>
      {room.lastEvent.nowPlayingContent.type === "none" ? (
        <Image
          w="100%"
          h="100%"
          fit="fill"
          alt="AprilTag"
          src="https://upload.wikimedia.org/wikipedia/commons/c/c4/PM5544_with_non-PAL_signals.png"
        />
      ) : null}
      {room.lastEvent.nowPlayingContent.type === "photo" ? (
        <Image
          w="100%"
          h="100%"
          fit="contain"
          alt="photo"
          src={`${room.lastEvent.nowPlayingContent.url}`}
        />
      ) : null}
      {room.lastEvent.nowPlayingContent.type === "video" ? (
        <VideoContent
          content={room.lastEvent.nowPlayingContent}
          key={room.lastEvent.nowPlayingContent.url}
        />
      ) : null}
      {room.lastEvent.nowPlayingContent.type === "iframe" ? (
        <iframe
          src={room.lastEvent.nowPlayingContent.url}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      ) : null}
    </>
  );
}
