import redis from "../redis";
import { roomContentFilename, roomContentType } from "../redis-keys";
import { type RoomContentType } from "../serialization";

const roomContentObject = {
  type: {
    async set(room: string, type: RoomContentType) {
      await redis.set(roomContentType(room), type);
    },
    async get(room: string): Promise<RoomContentType | null> {
      return (await redis.get(roomContentType(room))) as
        | "none"
        | "photo"
        | null;
    },
  },
  filename: {
    async set(room: string, filename: string) {
      await redis.set(roomContentFilename(room), filename);
    },
    async get(room: string) {
      return redis.get(roomContentFilename(room));
    },
  },
};

export default roomContentObject;
