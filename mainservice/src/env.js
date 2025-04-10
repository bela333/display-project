import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    REDIS_URL: z.string(),
    APRILTAG_URL: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    S3_ENDPOINT: z.string().optional(),
    S3_ENDPOINT_INTERNAL: z.string().optional(),
    S3_REGION: z.string(),
    S3_CALIBRATION_BUCKET: z.string(),
    S3_MEDIA_BUCKET: z.string(),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    REDIS_URL: process.env.REDIS_URL,
    APRILTAG_URL: process.env.APRILTAG_URL,
    NODE_ENV: process.env.NODE_ENV,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_ENDPOINT_INTERNAL: process.env.S3_ENDPOINT_INTERNAL,
    S3_REGION: process.env.S3_REGION,
    S3_CALIBRATION_BUCKET: process.env.S3_CALIBRATION_BUCKET,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_MEDIA_BUCKET: process.env.S3_MEDIA_BUCKET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
