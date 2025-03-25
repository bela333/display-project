import { PING_TIMEOUT } from "@/lib/consts";
import redis from "../redis";
import { screenPing } from "../redis-keys";

const screenPingObject = {
  async ping(room: string, screen: number) {
    await redis.set(screenPing(room, screen), 1, {
      EX: PING_TIMEOUT,
    });
  },
};

export default screenPingObject;
