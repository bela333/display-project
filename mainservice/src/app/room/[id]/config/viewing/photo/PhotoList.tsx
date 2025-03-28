import { use } from "react";
import roomContext from "../../../_contexts/roomContext";
import { ScrollArea } from "@mantine/core";
import UploadedPhoto from "./UploadedPhoto";

export default function PhotoList() {
  const room = use(roomContext);
  if (!room) {
    throw new Error("Loading...");
  }
  return (
    <ScrollArea h="calc(100vh - 10rem)">
      {room.lastEvent.uploaded.photos.map((photo) => (
        <UploadedPhoto photo={photo} key={photo.id} />
      ))}
    </ScrollArea>
  );
}
