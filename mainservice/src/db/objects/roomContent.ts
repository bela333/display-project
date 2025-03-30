import getRedis from "../redis";
import {
  roomContentUrl,
  roomContentType,
  roomContentStatusType,
  roomContentStatusTimestamp,
  roomContentStatusVideotime,
} from "../redis-keys";
import { type RoomContentType } from "../serialization";

const roomContentObject = {
  type: {
    async set(room: string, type: RoomContentType) {
      await (await getRedis()).set(roomContentType(room), type);
    },
    async get(room: string): Promise<RoomContentType | null> {
      return (await (
        await getRedis()
      ).get(roomContentType(room))) as RoomContentType | null;
    },
  },
  url: {
    async set(room: string, url: string) {
      await (await getRedis()).set(roomContentUrl(room), url);
    },
    async get(room: string) {
      return (await getRedis()).get(roomContentUrl(room));
    },
  },
  status: {
    type: {
      async get(room: string): Promise<"paused" | "playing" | null> {
        const redis = await getRedis();
        const resp = await redis.get(roomContentStatusType(room));
        return resp as "paused" | "playing" | null;
      },
      async set(room: string, type: "paused" | "playing") {
        const redis = await getRedis();
        await redis.set(roomContentStatusType(room), type);
      },
    },
    timestamp: {
      async get(room: string): Promise<number | null> {
        const redis = await getRedis();
        const resp = await redis.get(roomContentStatusTimestamp(room));
        if (resp === null) {
          return null;
        }
        return Number(resp);
      },
      async set(room: string, value: number) {
        const redis = await getRedis();
        await redis.set(roomContentStatusTimestamp(room), value);
      },
    },
    videotime: {
      async get(room: string): Promise<number | null> {
        const redis = await getRedis();
        const resp = await redis.get(roomContentStatusVideotime(room));
        if (resp === null) {
          return null;
        }
        return Number(resp);
      },
      async set(room: string, value: number) {
        const redis = await getRedis();
        await redis.set(roomContentStatusVideotime(room), value);
      },
    },
  },
};

export default roomContentObject;
