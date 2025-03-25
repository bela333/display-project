import { EXPIRE_SECONDS } from "@/lib/consts";
import redis from "../redis";
import { roomScreenAvailable } from "../redis-keys";

const roomScreenAvailableObject = {
  async members(room: string) {
    return (await redis.sMembers(roomScreenAvailable(room))).map(Number);
  },
  async add(room: string, screen: number) {
    await redis.sAdd(roomScreenAvailable(room), String(screen));
    await redis.expire(roomScreenAvailable(room), EXPIRE_SECONDS);
  },
  async rem(room: string, screen: number) {
    await redis.sRem(roomScreenAvailable(room), String(screen));
  },
};

export default roomScreenAvailableObject;
