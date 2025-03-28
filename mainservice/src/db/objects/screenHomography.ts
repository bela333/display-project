import { z } from "zod";
import redis from "../redis";
import { screenHomography } from "../redis-keys";
import { ROOM_LIFETIME } from "@/lib/consts";

export type HomographyMatrix = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

const screenHomographyObject = {
  async get(room: string, screen: number): Promise<HomographyMatrix | null> {
    const res = await redis.get(screenHomography(room, screen));
    if (res === null) {
      return null;
    }
    const zodRes = await z
      .array(z.array(z.number()).length(3))
      .length(3)
      .safeParseAsync(JSON.parse(res));
    if (!zodRes.success) {
      return null;
    }
    return zodRes.data as HomographyMatrix;
  },
  async set(room: string, screen: number, matrix: HomographyMatrix) {
    await redis.set(screenHomography(room, screen), JSON.stringify(matrix), {
      EX: ROOM_LIFETIME,
    });
  },
};

export default screenHomographyObject;
