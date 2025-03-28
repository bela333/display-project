import { ROOM_LIFETIME } from "@/lib/consts";
import redis from "../redis";
import { roomImageHeight, roomImageName, roomImageWidth } from "../redis-keys";

const roomImageObject = {
  name: {
    async get(room: string) {
      return redis.get(roomImageName(room));
    },
    async set(room: string, value: string) {
      return redis.set(roomImageName(room), value, {
        EX: ROOM_LIFETIME,
      });
    },
  },
  width: {
    async get(room: string) {
      const res = await redis.get(roomImageWidth(room));
      if (res === null) {
        return null;
      }
      return Number(res);
    },
    async set(room: string, value: number) {
      return redis.set(roomImageWidth(room), value, {
        EX: ROOM_LIFETIME,
      });
    },
  },
  height: {
    async get(room: string) {
      const res = await redis.get(roomImageHeight(room));
      if (res === null) {
        return null;
      }
      return Number(res);
    },
    async set(room: string, value: number) {
      return redis.set(roomImageHeight(room), value, {
        EX: ROOM_LIFETIME,
      });
    },
  },
};

export default roomImageObject;
