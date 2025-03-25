import redis from "../redis";
import { roomContentFilename, roomContentType } from "../redis-keys";

const roomContentObject = {
  type: {
    async set(room: string, type: "none" | "image") {
      await redis.set(roomContentType(room), type);
    },
    async get(room: string): Promise<"none" | "image" | null> {
      return (await redis.get(roomContentType(room))) as
        | "none"
        | "image"
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
