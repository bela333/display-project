"use server";
import {
  MAXIMUM_MEDIA_FILESIZE,
  MEDIA_SUPPORTED_EXTENSIONS,
} from "@/lib/consts";
import {
  type RoomUploadHandlerNeg,
  type RoomUploadHandlerPos,
} from "../../_components/RoomUploadButton";
import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";
import { DateTime } from "luxon";

export type HandleMediaUploadPos = RoomUploadHandlerPos & {
  filename: string;
};

export async function handleMediaUpload(
  filename: string,
  filesize: number
): Promise<HandleMediaUploadPos | RoomUploadHandlerNeg> {
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

  const uploadedFilename = `${randomUUID()}.${extension}`;
  const req = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: uploadedFilename,
    ContentLength: filesize,
  });
  const url = await getSignedUrl(s3Client, req, { expiresIn: 300 });
  return { url, filename: uploadedFilename, ok: true as const };
}
