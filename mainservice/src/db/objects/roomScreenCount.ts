import { ROOM_LIFETIME } from "@/lib/consts";
import { roomScreenCount } from "../redis-keys";
import getRedis from "../redis";

const roomScreenCountObject = {
  async get(room: string) {
    const res = await (await getRedis()).get(roomScreenCount(room));
    if (res === null) {
      return null;
    }
    return Number(res);
  },
  async incr(room: string) {
    return (await getRedis()).incr(roomScreenCount(room));
  },
  async set(room: string, value: number) {
    return (await getRedis()).set(roomScreenCount(room), value, {
      EX: ROOM_LIFETIME,
    });
  },
};

export default roomScreenCountObject;
