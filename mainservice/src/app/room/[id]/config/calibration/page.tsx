"use client";
import { Container, Stack } from "@mantine/core";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import processCalibrationFile from "./processCalibrationFile";

import CalibrationImage from "./CalibrationImage";
import RoomUploadButton from "../../../../RoomUploadButton";
import { handleApriltagUpload } from "./handleApriltagUpload";
import { CALIBRATION_SUPPORTED_MIME } from "@/lib/consts";
import { notifications } from "@mantine/notifications";

export default function ConfigCalibration() {
  const { id }: { id: string } = useParams();

  const onUpload = useCallback(
    async ({ filename }: { filename: string }) => {
      const res = await processCalibrationFile(id, filename);
      if (!res.ok && res.message) {
        notifications.show({
          message: res.message,
          color: "red",
        });
        return;
      }
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
        <CalibrationImage />
      </Stack>
    </Container>
  );
}
