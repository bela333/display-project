import { Group, Text } from "@mantine/core";
import { Dropzone, type FileWithPath } from "@mantine/dropzone";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { requestFileUpload } from "./requestFileUpload";
import { CALIBRATION_SUPPORTED_MIME } from "@/lib/consts";

export type Props = {
  onUpload: (filename: string) => void;
};

export default function ApriltagImageDropzone({ onUpload }: Props) {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    async (files: FileWithPath[]) => {
      setLoading(true);
      try {
        const file = files.at(0);
        if (!file) {
          return; // TODO: Handle error
        }
        const resp = await requestFileUpload(file.name, file.size);
        if (!resp.ok) {
          alert(resp.message);
          return; // TODO: Handle error BETTER
        }
        // TODO: Maybe replace this with a XHR, so that we can track progress?
        const req = await fetch(resp.url, { method: "PUT", body: file });
        await req.text();
        onUpload(resp.filename);
      } finally {
        setLoading(false);
      }
    },
    [onUpload]
  );

  return (
    <Dropzone
      onDrop={onDrop}
      onReject={(files) => console.log("rejected files", files)}
      accept={[...CALIBRATION_SUPPORTED_MIME]}
      multiple={false}
      loading={loading}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size={52}
            color="var(--mantine-color-blue-6)"
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            size={52}
            color="var(--mantine-color-dimmed)"
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach a single file
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
