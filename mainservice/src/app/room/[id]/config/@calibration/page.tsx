"use client";
import { Container, Stack } from "@mantine/core";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import processFile from "./processFile";

import PreviewImage from "./PreviewImage";
import RoomUploadButton from "../../_components/RoomUploadButton";
import { handleApriltagUpload } from "./handleApriltagUpload";
import { CALIBRATION_SUPPORTED_MIME } from "@/lib/consts";

export default function ConfigCalibration() {
  const { id }: { id: string } = useParams();

  const onUpload = useCallback(
    async ({ filename }: { filename: string }) => {
      await processFile(id, filename);
    },
    [id]
  );

  return (
    <Container>
      <Stack>
        <RoomUploadButton
          onUpload={onUpload}
          handleRequest={handleApriltagUpload}
          supportedMimeTypes={CALIBRATION_SUPPORTED_MIME}
          title="Upload calibration image"
        />
        <PreviewImage />
      </Stack>
    </Container>
  );
}
