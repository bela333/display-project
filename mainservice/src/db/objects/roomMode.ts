import { ROOM_LIFETIME } from "@/lib/consts";
import { type Modes } from "../serialization";
import { roomMode } from "../redis-keys";
import getRedis from "../redis";

const roomModeObject = {
  async set(room: string, mode: Modes) {
    await (
      await getRedis()
    ).set(roomMode(room), mode, {
      EX: ROOM_LIFETIME,
    });
  },
  async get(room: string): Promise<Modes | null> {
    const res = await (await getRedis()).get(roomMode(room));
    if (res) {
      return res as Modes;
    }
    return null;
  },
};

export default roomModeObject;
