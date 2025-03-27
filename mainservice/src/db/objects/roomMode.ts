import { EXPIRE_SECONDS } from "@/lib/consts";
import { type Modes } from "../serialization";
import redis from "../redis";
import { roomMode } from "../redis-keys";

const roomModeObject = {
  async set(room: string, mode: Modes) {
    await redis.set(roomMode(room), mode, {
      EX: EXPIRE_SECONDS,
    });
  },
  async get(room: string): Promise<Modes | null> {
    const res = await redis.get(roomMode(room));
    if (res) {
      return res as Modes;
    }
    return null;
  },
};

export default roomModeObject;
