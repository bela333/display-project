import { PING_TIMEOUT } from "@/lib/consts";
import { screenPing } from "../redis-keys";
import getRedis from "../redis";

const screenPingObject = {
  async ping(room: string, screen: number) {
    await (
      await getRedis()
    ).set(screenPing(room, screen), 1, {
      EX: PING_TIMEOUT,
    });
  },
};

export default screenPingObject;
