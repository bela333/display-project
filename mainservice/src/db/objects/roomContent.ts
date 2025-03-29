import getRedis from "../redis";
import { roomContentFilename, roomContentType } from "../redis-keys";
import { type RoomContentType } from "../serialization";

const roomContentObject = {
  type: {
    async set(room: string, type: RoomContentType) {
      await (await getRedis()).set(roomContentType(room), type);
    },
    async get(room: string): Promise<RoomContentType | null> {
      return (await (await getRedis()).get(roomContentType(room))) as
        | "none"
        | "photo"
        | null;
    },
  },
  filename: {
    async set(room: string, filename: string) {
      await (await getRedis()).set(roomContentFilename(room), filename);
    },
    async get(room: string) {
      return (await getRedis()).get(roomContentFilename(room));
    },
  },
};

export default roomContentObject;
