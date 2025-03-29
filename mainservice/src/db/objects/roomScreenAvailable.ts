import { ROOM_LIFETIME } from "@/lib/consts";
import { roomScreenAvailable } from "../redis-keys";
import getRedis from "../redis";

const roomScreenAvailableObject = {
  async members(room: string) {
    return (await (await getRedis()).sMembers(roomScreenAvailable(room))).map(
      Number
    );
  },
  async add(room: string, screen: number) {
    await (await getRedis()).sAdd(roomScreenAvailable(room), String(screen));
    await (await getRedis()).expire(roomScreenAvailable(room), ROOM_LIFETIME);
  },
  async rem(room: string, screen: number) {
    await (await getRedis()).sRem(roomScreenAvailable(room), String(screen));
  },
};

export default roomScreenAvailableObject;
