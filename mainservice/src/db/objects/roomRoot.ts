import { EXPIRE_SECONDS } from "@/lib/consts";
import redis from "../redis";

const roomRootObject = {
  async exists(room: string) {
    return !!(await redis.exists(room));
  },
  async touch(room: string) {
    await redis.set(room, 1, {
      EX: EXPIRE_SECONDS,
    });
  },
};

export default roomRootObject;
