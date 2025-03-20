import { Button, FileButton } from "@mantine/core";
import { useCallback, useState } from "react";
import { requestFileUpload } from "./requestFileUpload";
import { CALIBRATION_SUPPORTED_MIME } from "@/lib/consts";

export type Props = {
  onUpload: (filename: string) => void;
};

export default function ApriltagImageButton({ onUpload }: Props) {
  const [loading, setLoading] = useState(false);

  const onChange = useCallback(
    async (file: File | null) => {
      setLoading(true);
      try {
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
    <FileButton
      onChange={onChange}
      accept={[...CALIBRATION_SUPPORTED_MIME].join(",")}
    >
      {(props) => (
        <Button {...props} loading={loading}>
          Upload calibration image
        </Button>
      )}
    </FileButton>
  );
}
