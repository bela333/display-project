import getRedis from "../redis";
import { roomCount } from "../redis-keys";

const roomCountObject = {
  async incr() {
    return await (await getRedis()).incr(roomCount());
  },
  async get() {
    return Number((await (await getRedis()).get(roomCount()))!);
  },
};

export default roomCountObject;
