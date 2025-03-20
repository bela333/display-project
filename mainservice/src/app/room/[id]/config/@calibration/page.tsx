"use client";
import { Container, Stack } from "@mantine/core";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import processFile from "./processFile";

import PreviewImage from "./PreviewImage";
import ApriltagImageButton from "@/app/_components/ApriltagImageButton";

export default function ConfigCalibration() {
  const { id }: { id: string } = useParams();

  const onUpload = useCallback(
    async (filename: string) => {
      await processFile(id, filename);
    },
    [id]
  );

  return (
    <Container>
      <Stack>
        <ApriltagImageButton onUpload={onUpload} />
        <PreviewImage />
      </Stack>
    </Container>
  );
}
