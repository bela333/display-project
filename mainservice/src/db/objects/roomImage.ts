import { ROOM_LIFETIME } from "@/lib/consts";
import { roomImageHeight, roomImageName, roomImageWidth } from "../redis-keys";
import getRedis from "../redis";

const roomImageObject = {
  name: {
    async get(room: string) {
      return (await getRedis()).get(roomImageName(room));
    },
    async set(room: string, value: string) {
      return (await getRedis()).set(roomImageName(room), value, {
        EX: ROOM_LIFETIME,
      });
    },
  },
  width: {
    async get(room: string) {
      const res = await (await getRedis()).get(roomImageWidth(room));
      if (res === null) {
        return null;
      }
      return Number(res);
    },
    async set(room: string, value: number) {
      return (await getRedis()).set(roomImageWidth(room), value, {
        EX: ROOM_LIFETIME,
      });
    },
  },
  height: {
    async get(room: string) {
      const res = await (await getRedis()).get(roomImageHeight(room));
      if (res === null) {
        return null;
      }
      return Number(res);
    },
    async set(room: string, value: number) {
      return (await getRedis()).set(roomImageHeight(room), value, {
        EX: ROOM_LIFETIME,
      });
    },
  },
};

export default roomImageObject;
