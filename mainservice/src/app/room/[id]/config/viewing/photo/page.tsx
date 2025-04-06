"use client";
import { Stack } from "@mantine/core";
import RoomUploadButton from "../../../../../RoomUploadButton";
import { useCallback } from "react";
import {
  handlePhotoUpload,
  type handlePhotoUploadPos,
} from "./handlePhotoUpload";
import { MEDIA_SUPPORTED_MIME } from "@/lib/consts";
import { useParams } from "next/navigation";
import { onPhotoUploaded } from "./onPhotoUploaded";
import PhotoList from "./PhotoList";
import { notifications } from "@mantine/notifications";

export default function PhotoPage() {
  const { id: room }: { id: string } = useParams();

  const onUpload = useCallback(
    async ({ id }: handlePhotoUploadPos) => {
      const res = await onPhotoUploaded(room, id);
      if (!res.ok) {
        notifications.show({
          message: res.message,
          color: "red",
        });
      }
    },
    [room]
  );

  return (
    <Stack>
      <RoomUploadButton
        handleRequest={handlePhotoUpload}
        onUpload={onUpload}
        supportedMimeTypes={MEDIA_SUPPORTED_MIME}
        title="Upload photo"
      />
      <PhotoList />
    </Stack>
  );
}
