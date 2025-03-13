declare namespace NodeJS {
  interface ProcessEnv {
    readonly REDIS_URL?: string;
    readonly APRILTAG_URL?: string;
    readonly S3_ENDPOINT?: string;
    readonly S3_ENDPOINT_INTERNAL?: string;
    readonly S3_BUCKET: string;
    readonly S3_REGION: string;
    readonly S3_ACCESS_KEY_ID: string;
    readonly S3_SECRET_ACCESS_KEY: string;
  }
}
