import { screenConfigZod, type ScreenConfig } from "@/lib/screenConfig";
import redis from "../redis";
import { screenConfig } from "../redis-keys";
import { ROOM_LIFETIME } from "@/lib/consts";

const screenConfigObject = {
  async set(room: string, screen: number, config: ScreenConfig) {
    await redis.set(screenConfig(room, screen), JSON.stringify(config), {
      EX: ROOM_LIFETIME,
    });
  },
  async get(room: string, screen: number): Promise<ScreenConfig | null> {
    const res = await redis.get(screenConfig(room, screen));
    if (res === null) {
      return null;
    }
    const zodRes = await screenConfigZod.safeParseAsync(JSON.parse(res));
    if (!zodRes.success) {
      return null;
    }
    return zodRes.data;
  },
};

export default screenConfigObject;
