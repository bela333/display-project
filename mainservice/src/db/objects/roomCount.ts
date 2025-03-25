import redis from "../redis";
import { roomCount } from "../redis-keys";

const roomCountObject = {
  async incr() {
    return await redis.incr(roomCount());
  },
  async get() {
    return Number((await redis.get(roomCount()))!);
  },
};

export default roomCountObject;
