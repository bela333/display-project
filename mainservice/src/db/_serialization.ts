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

export type SerializedContent =
  | { type: "none" }
  | { type: "image"; filename: string; url: string };

export type Modes = "calibration" | "viewing";

export type SerializedRoom = {
  screenCount: number;
  // TODO: This is a horrible name wtf
  screenLocals: SerializedScreen[];
  mode: Modes;
  image?: SerializedImage;
  content: SerializedContent;
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

export const serializeRoom = async (room: string): Promise<SerializedRoom> => {
  const screenCount = await roomScreenCountObject.get(room);

  const screens = await roomScreenAvailableObject.members(room);

  const screenLocals = (
    await Promise.all(
      screens.map<Promise<SerializedScreen | null>>(async (screen) =>
        serializeScreen(room, screen)
      )
    )
  ).filter((a) => a !== null);

  const mode = await roomModeObject.get(room);

  if (mode !== "viewing" && mode !== "calibration") {
    throw new Error(`Invalid mode: ${mode}`);
  }

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

  const contentType = (await roomContentObject.type.get(room)) ?? "none";

  let content: SerializedContent = { type: "none" };

  if (contentType === "image") {
    const filename = await roomContentObject.filename.get(room);

    content = {
      type: "image",
      filename: filename ?? "",
      url:
        filename !== null
          ? `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${filename}`
          : "",
    };
  }

  return {
    screenCount: Number(screenCount),
    screenLocals: screenLocals,
    mode,
    image,
    content,
  };
};
