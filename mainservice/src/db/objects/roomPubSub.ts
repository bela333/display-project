import getRedis from "../redis";
import { roomPubSub } from "../redis-keys";

const roomPubSubObject = {
  async ping(room: string) {
    await (await getRedis()).publish(roomPubSub(room), "ping");
  },
};

export default roomPubSubObject;
