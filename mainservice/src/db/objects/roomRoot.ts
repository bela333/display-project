import { ROOM_LIFETIME } from "@/lib/consts";
import redis from "../redis";

const roomRootObject = {
  async exists(room: string) {
    return !!(await redis.exists(room));
  },
  async touch(room: string) {
    await redis.set(room, 1, {
      EX: ROOM_LIFETIME,
    });
  },
};

export default roomRootObject;
