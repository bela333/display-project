import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
});
export const s3Client_internal = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.S3_ENDPOINT_INTERNAL,
  forcePathStyle: true,
});
