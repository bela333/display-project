import { type SerializedUploadedPhoto } from "@/db/serialization";
import { Box } from "@mantine/core";
import style from "./UploadedPhoto.module.css";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { setContentToPhoto } from "./setContentToPhoto";

export default function UploadedPhoto({
  photo,
}: {
  photo: SerializedUploadedPhoto;
}) {
  const { id: room } = useParams<{ id: string }>();
  const onClick = useCallback(() => {
    void setContentToPhoto(room, photo.id);
  }, [room, photo.id]);

  return (
    <Box className={style.uploadedPhoto} onClick={onClick}>
      {/* TODO: Generate thumbnails (maybe imagor??) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.url}
        alt={photo.filename}
        width="100%"
        height="100%"
        className={style.thumbnail}
      />
      {photo.filename}
    </Box>
  );
}
