"use server";
import {
  CALIBRATION_SUPPORTED_EXTENSIONS,
  MAXIMUM_FILESIZE,
} from "@/lib/consts";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
});

export async function requestFileUpload(filename: string, filesize: number) {
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

  const req = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: uploadedFilename,
    ContentLength: filesize,
  });
  const url = await getSignedUrl(s3Client, req, { expiresIn: 300 });
  return { url, filename: uploadedFilename, ok: true as const };
}
