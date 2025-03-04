declare namespace NodeJS {
  interface ProcessEnv {
    readonly REDIS_URL?: string;
    readonly APRILTAG_URL?: string;
  }
}
