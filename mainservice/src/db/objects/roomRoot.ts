import { ROOM_LIFETIME } from "@/lib/consts";
import getRedis from "../redis";
import { roomRoot } from "../redis-keys";

const roomRootObject = {
  async exists(room: string) {
    return !!(await (await getRedis()).exists(roomRoot(room)));
  },
  async touch(room: string) {
    await (
      await getRedis()
    ).set(roomRoot(room), 1, {
      EX: ROOM_LIFETIME,
    });
  },
};

export default roomRootObject;
