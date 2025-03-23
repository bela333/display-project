"use server";
import {
  CALIBRATION_SUPPORTED_EXTENSIONS,
  MAXIMUM_FILESIZE,
} from "@/lib/consts";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

export async function requestApriltagUpload(
  filename: string,
  filesize: number
) {
  if (filesize > MAXIMUM_FILESIZE) {
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
  //TODO: Add expiry
  const req = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: uploadedFilename,
    ContentLength: filesize,
  });
  const url = await getSignedUrl(s3Client, req, { expiresIn: 300 });
  return { url, filename: uploadedFilename, ok: true as const };
}
