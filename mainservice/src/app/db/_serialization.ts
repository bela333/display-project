import { screenConfigZod, type ScreenConfig } from "@/lib/screenConfig";
import redis from "./redis";
import {
  roomImageHeight,
  roomImageName,
  roomImageWidth,
  roomMode,
  roomScreenAvailable,
  roomScreenCount,
  screenConfig,
  screenHomography,
} from "./redis-keys";
import { z } from "zod";

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

export type Modes = "calibration" | "viewing";

export type SerializedRoom = {
  screenCount: number;
  // TODO: This is a horrible name wtf
  screenLocals: SerializedScreen[];
  mode: Modes;
  image?: SerializedImage;
};

export const serializeScreen = async (
  room: string,
  screen: number
): Promise<SerializedScreen | null> => {
  const config = await redis.get(screenConfig(room, screen));
  if (!config) {
    return null;
  }
  const result = await screenConfigZod.safeParseAsync(JSON.parse(config));
  if (!result.success) {
    return null;
  }

  const ret: SerializedScreen = {
    ...result.data,
    id: String(screen),
  };

  const homographyJson = await redis.get(screenHomography(room, screen));
  if (homographyJson !== null) {
    const homography = await z
      .array(z.array(z.number()).length(3))
      .length(3)
      .safeParseAsync(JSON.parse(homographyJson));
    if (homography.success) {
      // Type arises from zod parsing
      ret.homography = homography.data as [MatrixRow, MatrixRow, MatrixRow];
    }
  }

  return ret;
};

export const serializeRoom = async (room: string): Promise<SerializedRoom> => {
  const screenCount = await redis.get(roomScreenCount(room));

  const screens = await redis.sMembers(roomScreenAvailable(room));

  const screenLocals = (
    await Promise.all(
      screens.map<Promise<SerializedScreen | null>>(async (screen) =>
        serializeScreen(room, Number(screen))
      )
    )
  ).filter((a) => a !== null);

  const mode = await redis.get(roomMode(room));
  if (mode !== "viewing" && mode !== "calibration") {
    throw new Error(`Invalid mode: ${mode}`);
  }

  const filename = await redis.get(roomImageName(room));
  const width = Number(await redis.get(roomImageWidth(room)));
  const height = Number(await redis.get(roomImageHeight(room)));

  const image: SerializedImage =
    filename && width && height
      ? {
          filename,
          height,
          width,
          url: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${filename}`,
        }
      : undefined;

  return {
    screenCount: Number(screenCount),
    screenLocals: screenLocals,
    mode,
    image,
  };
};
