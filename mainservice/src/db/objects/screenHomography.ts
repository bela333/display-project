import { z } from "zod";
import { screenHomography } from "../redis-keys";
import { ROOM_LIFETIME } from "@/lib/consts";
import getRedis from "../redis";

export type HomographyMatrix = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

const screenHomographyObject = {
  async get(room: string, screen: number): Promise<HomographyMatrix | null> {
    const res = await (await getRedis()).get(screenHomography(room, screen));
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
    await (
      await getRedis()
    ).set(screenHomography(room, screen), JSON.stringify(matrix), {
      EX: ROOM_LIFETIME,
    });
  },
  async del(room: string, screen: number) {
    await (await getRedis()).del(screenHomography(room, screen));
  },
};

export default screenHomographyObject;
