"use server";
import {
  MAXIMUM_MEDIA_FILESIZE,
  MEDIA_SUPPORTED_EXTENSIONS,
} from "@/lib/consts";
import {
  type RoomUploadHandlerNeg,
  type RoomUploadHandlerPos,
} from "../../../../../RoomUploadButton";
import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";
import roomPhotosObject from "@/db/objects/roomPhotos";

export type handlePhotoUploadPos = RoomUploadHandlerPos & {
  id: string;
};

export async function handlePhotoUpload({
  filename,
  filesize,
  room,
}: {
  filename: string;
  filesize: number;
  room: string;
}): Promise<handlePhotoUploadPos | RoomUploadHandlerNeg> {
  if (filesize > MAXIMUM_MEDIA_FILESIZE) {
    return {
      ok: false,
      message: "File too large.",
    };
  }
  const filenameParts = filename.split(".");
  const extension = filenameParts.at(filenameParts.length - 1);

  if (
    !extension ||
    !MEDIA_SUPPORTED_EXTENSIONS.find((ext) => ext === extension)
  ) {
    return { ok: false as const, message: "Invalid extension" };
  }

  const id = randomUUID();

  const uploadedFilename = `${id}.${extension}`;
  const req = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: uploadedFilename,
    ContentLength: filesize,
  });
  const url = await getSignedUrl(s3Client, req, { expiresIn: 300 });

  await roomPhotosObject.photoName.set(room, id, filename);
  await roomPhotosObject.photoPath.set(room, id, uploadedFilename);

  return { url, id, ok: true as const };
}
