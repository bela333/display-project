import { ROOM_LIFETIME } from "@/lib/consts";
import getRedis from "../redis";

const roomRootObject = {
  async exists(room: string) {
    return !!(await (await getRedis()).exists(room));
  },
  async touch(room: string) {
    await (
      await getRedis()
    ).set(room, 1, {
      EX: ROOM_LIFETIME,
    });
  },
};

export default roomRootObject;
