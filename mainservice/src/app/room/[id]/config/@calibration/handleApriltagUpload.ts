"use server";
import {
  CALIBRATION_SUPPORTED_EXTENSIONS,
  MAXIMUM_CALIBRATION_FILESIZE,
} from "@/lib/consts";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import {
  type RoomUploadHandlerNeg,
  type RoomUploadHandlerPos,
} from "../../_components/RoomUploadButton";
import { DateTime } from "luxon";

export type RequestApriltagUploadPos = RoomUploadHandlerPos & {
  filename: string;
};

export async function handleApriltagUpload(
  filename: string,
  filesize: number
): Promise<RequestApriltagUploadPos | RoomUploadHandlerNeg> {
  if (filesize > MAXIMUM_CALIBRATION_FILESIZE) {
    return { message: "File too large.", ok: false as const };
  }

  const filenameParts = filename.split(".");
  const extension = filenameParts.at(filenameParts.length - 1);

  if (
    !extension ||
    !CALIBRATION_SUPPORTED_EXTENSIONS.find((ext) => ext === extension)
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
