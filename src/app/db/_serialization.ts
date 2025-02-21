import { screenConfigZod, type ScreenConfig } from "@/lib/screenConfig";
import redis from "./redis";
import {
  roomMode,
  roomScreenAvailable,
  roomScreenCount,
  screenConfig,
} from "./redis-keys";

export type SerializedScreen = ScreenConfig & {
  id: string;
};

export type Modes = "calibration" | "viewing";

export type SerializedRoom = {
  screenCount: number;
  screenLocals: SerializedScreen[];
  mode: Modes;
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
  return { ...result.data, id: String(screen) };
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

  return {
    screenCount: Number(screenCount),
    screenLocals: screenLocals,
    mode,
  };
};
