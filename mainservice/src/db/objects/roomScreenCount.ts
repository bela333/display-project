import { ROOM_LIFETIME } from "@/lib/consts";
import redis from "../redis";
import { roomScreenCount } from "../redis-keys";

const roomScreenCountObject = {
  async get(room: string) {
    const res = await redis.get(roomScreenCount(room));
    if (res === null) {
      return null;
    }
    return Number(res);
  },
  async incr(room: string) {
    return redis.incr(roomScreenCount(room));
  },
  async set(room: string, value: number) {
    return redis.set(roomScreenCount(room), value, {
      EX: ROOM_LIFETIME,
    });
  },
};

export default roomScreenCountObject;
