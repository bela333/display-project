import redis from "../redis";
import { roomPubSub } from "../redis-keys";

const roomPubSubObject = {
  async ping(room: string) {
    await redis.publish(roomPubSub(room), "ping");
  },
};

export default roomPubSubObject;
