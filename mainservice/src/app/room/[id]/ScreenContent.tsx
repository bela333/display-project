import { useContext } from "react";
import roomContext from "./_contexts/roomContext";
import { Image } from "@mantine/core";

export function ScreenContent() {
  const room = useContext(roomContext);

  if (room === undefined) {
    return;
  }

  return (
    <>
      {room.lastEvent.serializedNowPlayingContent.type === "none" ? (
        <Image
          w="100%"
          h="100%"
          fit="fill"
          alt="AprilTag"
          src="https://upload.wikimedia.org/wikipedia/commons/c/c4/PM5544_with_non-PAL_signals.png"
        />
      ) : null}
      {room.lastEvent.serializedNowPlayingContent.type === "image" ? (
        <Image
          w="100%"
          h="100%"
          fit="contain"
          alt="Image"
          src={`${room.lastEvent.serializedNowPlayingContent.url}`}
        />
      ) : null}
    </>
  );
}
