"use client";
import { Container, Stack } from "@mantine/core";
import RoomUploadButton from "../../../../RoomUploadButton";
import { useCallback } from "react";
import {
  handleMediaUpload,
  type HandleMediaUploadPos,
} from "./handleMediaUpload";
import { MEDIA_SUPPORTED_MIME } from "@/lib/consts";
import { useParams } from "next/navigation";
import { onMediaUploaded } from "./onMediaUploaded";

export default function ConfigViewing() {
  const { id }: { id: string } = useParams();

  const onUpload = useCallback(
    async ({ filename }: HandleMediaUploadPos) => {
      void onMediaUploaded(id, filename);
    },
    [id]
  );

  return (
    <Container>
      <Stack>
        <RoomUploadButton
          handleRequest={handleMediaUpload}
          onUpload={onUpload}
          supportedMimeTypes={MEDIA_SUPPORTED_MIME}
          title="Upload media"
        />
      </Stack>
    </Container>
  );
}
