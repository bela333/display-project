import { type ScreenConfig } from "@/lib/screenConfig";
import roomModeObject from "./objects/roomMode";
import roomScreenCountObject from "./objects/roomScreenCount";
import roomScreenAvailableObject from "./objects/roomScreenAvailable";
import roomImageObject from "./objects/roomImage";
import roomContentObject from "./objects/roomContent";
import screenConfigObject from "./objects/screenConfig";
import screenHomographyObject from "./objects/screenHomography";

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

export type SerializedNowPlayingContent =
  | { type: "none" }
  | { type: "image"; filename: string; url: string };

export type Modes = "calibration" | "viewing";

export type SerializedRoom = {
  screenCount: number;
  // TODO: This is a horrible name wtf
  serializedScreens: SerializedScreen[];
  mode: Modes;
  image?: SerializedImage;
  serializedNowPlayingContent: SerializedNowPlayingContent;
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

export async function serializeNowPlayingContent(
  room: string
): Promise<SerializedNowPlayingContent> {
  const contentType = (await roomContentObject.type.get(room)) ?? "none";
  switch (contentType) {
    case "none":
      return { type: "none" };
    case "image":
      const filename = await roomContentObject.filename.get(room);
      const url =
        filename !== null
          ? `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${filename}`
          : "";

      return { type: "image", filename: filename ?? "", url };
  }
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

  return {
    screenCount: Number(screenCount),
    serializedScreens,
    mode,
    image,
    serializedNowPlayingContent,
  };
};
