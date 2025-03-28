import { Button, FileButton } from "@mantine/core";
import { useParams } from "next/navigation";
import { use, useCallback, useState } from "react";

export type RoomUploadHandlerPos = {
  ok: true;
  url: string;
};

export type RoomUploadHandlerNeg = {
  ok: false;
  message: string;
};

export type Props<T extends RoomUploadHandlerPos> = {
  handleRequest: (request: {
    filename: string;
    filesize: number;
    room: string;
  }) => Promise<T | RoomUploadHandlerNeg>;
  onUpload: (resp: T) => Promise<void>;
  supportedMimeTypes: readonly string[];
  title?: string;
};

export default function RoomUploadButton<T extends RoomUploadHandlerPos>({
  handleRequest,
  onUpload,
  supportedMimeTypes,
  title,
}: Props<T>) {
  const [loading, setLoading] = useState(false);
  const { id: room } = useParams<{ id: string }>();

  const onChange = useCallback(
    async (file: File | null) => {
      setLoading(true);
      try {
        if (!file) {
          return; // TODO: Handle error
        }
        const resp = await handleRequest({
          filename: file.name,
          filesize: file.size,
          room,
        });
        if (!resp.ok) {
          alert(resp.message);
          return; // TODO: Handle error BETTER
        }
        // TODO: Maybe replace this with a XHR, so that we can track progress?
        const req = await fetch(resp.url, { method: "PUT", body: file });
        await req.text();
        await onUpload(resp);
      } finally {
        setLoading(false);
      }
    },
    [handleRequest, room, onUpload]
  );

  return (
    <FileButton onChange={onChange} accept={supportedMimeTypes.join(",")}>
      {(props) => (
        <Button {...props} loading={loading}>
          {title ?? "Upload"}
        </Button>
      )}
    </FileButton>
  );
}
