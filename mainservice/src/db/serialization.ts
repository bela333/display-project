import { type ScreenConfig } from "@/lib/screenConfig";
import roomModeObject from "./objects/roomMode";
import roomScreenCountObject from "./objects/roomScreenCount";
import roomScreenAvailableObject from "./objects/roomScreenAvailable";
import roomImageObject from "./objects/roomImage";
import roomContentObject from "./objects/roomContent";
import screenConfigObject from "./objects/screenConfig";
import screenHomographyObject from "./objects/screenHomography";
import roomPhotosObject from "./objects/roomPhotos";

type MatrixRow = [number, number, number];

export type SerializedScreen = ScreenConfig & {
  id: string;
  homography?: [MatrixRow, MatrixRow, MatrixRow];
};

export type SerializedImage = {
  filename: string;
  url: string;
  width: number;
  height: number;
};

export type SerializedPhotoContent = {
  type: "photo";
  url: string;
};

export type SerializedEmbeddedVideoContent = {
  type: "video";
  url: string;
  status: ({ type: "paused" } | { type: "playing" }) & {
    /** UNIX timestamp for when playback status was set to this state (milliseconds) */
    timestamp: number;
    /** Time of playback when playback status was set to this state (seconds) */
    videotime: number;
  };
};

export type SerializedNowPlayingContent =
  | { type: "none" }
  | SerializedPhotoContent
  | SerializedEmbeddedVideoContent;

export type RoomContentType = SerializedNowPlayingContent["type"];

export type SerializedUploadedPhoto = {
  filename: string;
  url: string;
  id: string;
};

export type Modes = "calibration" | "viewing";

export type SerializedRoom = {
  screenCount: number;
  serializedScreens: SerializedScreen[];
  mode: Modes;
  image?: SerializedImage;
  nowPlayingContent: SerializedNowPlayingContent;
  uploaded: { photos: SerializedUploadedPhoto[] };
};

export const serializeScreen = async (
  room: string,
  screen: number
): Promise<SerializedScreen | null> => {
  const config = await screenConfigObject.get(room, screen);

  if (config === null) {
    return null;
  }

  const ret: SerializedScreen = {
    ...config,
    id: String(screen),
  };

  ret.homography =
    (await screenHomographyObject.get(room, screen)) ?? undefined;

  return ret;
};

async function serializePhotoContent(
  room: string
): Promise<SerializedPhotoContent> {
  const filename = await roomContentObject.url.get(room);
  const url =
    filename !== null
      ? `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${filename}`
      : "";

  return { type: "photo", url };
}

async function serializeEmbeddedVideoContent(
  room: string
): Promise<SerializedEmbeddedVideoContent | { type: "none" }> {
  const url = await roomContentObject.url.get(room);
  const statusType = await roomContentObject.status.type.get(room);
  const timestamp = await roomContentObject.status.timestamp.get(room);
  const videotime = await roomContentObject.status.videotime.get(room);
  if (
    url === null ||
    statusType === null ||
    timestamp === null ||
    videotime === null
  ) {
    return {
      type: "none",
    };
  }
  let status: ({ type: "paused" } | { type: "playing" }) & {
    timestamp: number;
    videotime: number;
  };
  switch (statusType) {
    case "paused":
      status = {
        type: "paused",
        timestamp,
        videotime,
      };
      break;
    case "playing":
      const elapsed = Date.now() - timestamp;
      status = {
        type: "playing",
        timestamp,
        videotime: videotime + elapsed / 1000,
      };
      break;
  }
  return {
    type: "video",
    url,
    status,
  };
}

export async function serializeNowPlayingContent(
  room: string
): Promise<SerializedNowPlayingContent> {
  const contentType = (await roomContentObject.type.get(room)) ?? "none";
  switch (contentType) {
    case "none":
      return { type: "none" };
    case "photo":
      return serializePhotoContent(room);
    case "video":
      return serializeEmbeddedVideoContent(room);
  }
}

export async function serializeUploadedPhotos(
  room: string
): Promise<SerializedUploadedPhoto[]> {
  const ids = await roomPhotosObject.photosSet.get(room);
  return Promise.all(
    ids.map<Promise<SerializedUploadedPhoto>>(async (id) => {
      const path = (await roomPhotosObject.photoPath.get(room, id)) ?? "";
      const filename = (await roomPhotosObject.photoName.get(room, id)) ?? "";
      return {
        filename,
        url: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${path}`,
        id,
      };
    })
  );
}
export const serializeRoom = async (room: string): Promise<SerializedRoom> => {
  // Get information about screens

  const screenCount = await roomScreenCountObject.get(room);
  const screens = await roomScreenAvailableObject.members(room);

  const serializedScreens = (
    await Promise.all(
      screens.map<Promise<SerializedScreen | null>>(async (screen) =>
        serializeScreen(room, screen)
      )
    )
  ).filter((a) => a !== null);

  // Get current mode

  const mode = await roomModeObject.get(room);

  if (mode !== "viewing" && mode !== "calibration") {
    throw new Error(`Invalid mode: ${mode}`);
  }

  // Get information about calibration image

  const filename = await roomImageObject.name.get(room);
  const width = await roomImageObject.width.get(room);
  const height = await roomImageObject.height.get(room);

  const image: SerializedImage | undefined =
    filename && width && height
      ? {
          filename,
          height,
          width,
          url: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${filename}`,
        }
      : undefined;

  // Get information about the Now Playing content
  const serializedNowPlayingContent = await serializeNowPlayingContent(room);

  const serializedUploadedPhotos = await serializeUploadedPhotos(room);

  return {
    screenCount: Number(screenCount),
    serializedScreens,
    mode,
    image,
    nowPlayingContent: serializedNowPlayingContent,
    uploaded: { photos: serializedUploadedPhotos },
  };
};
