export const CODE_LENGTH = 8;
export const CODE_ALPHABET = "ABCDEFGHIKMNOPRS";
export const CODE_REGEX = new RegExp(`^[^:]+`);
export const EXPIRE_SECONDS = 60 * 60 * 24; // 1 calendar day

export const PING_INTERVAL = 30;
export const PING_TIMEOUT = 120;

export const MAXIMUM_CALIBRATION_FILESIZE = 16 * 1024 * 1024; // 16 MB
export const CALIBRATION_SUPPORTED_MIME = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
] as const;
export const CALIBRATION_SUPPORTED_EXTENSIONS = [
  "png",
  "jpeg",
  "jpg",
  "webp",
  "avif",
  "heic",
  "heif",
] as const;

export const MAXIMUM_MEDIA_FILESIZE = 16 * 1024 * 1024; // 16 MB
export const MEDIA_SUPPORTED_MIME = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/gif",
] as const;
export const MEDIA_SUPPORTED_EXTENSIONS = [
  "png",
  "jpeg",
  "jpg",
  "webp",
  "avif",
  "heic",
  "heif",
  "gif",
] as const;
