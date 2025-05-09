import { deregisterScreen } from "@/app/room/[id]/view/[screen]/_actions/screenRegistration";
import { type RedisClientType } from "@redis/client";

const screenKeyRegex = /^room:([^:]+):screen:(\d+):ping$/;

export async function setupScreenExpiry(redis: RedisClientType) {
  await redis.configSet("notify-keyspace-events", "Ex");
  const listener = redis.duplicate();
  await listener.connect();
  void listener.subscribe("__keyevent@0__:expired", (key) => {
    const matches = key.match(screenKeyRegex);
    if (matches === null) {
      return;
    }
    const roomID = matches[1];
    const screenID = matches[2];
    if (!roomID || !screenID) {
      console.error("Invalid expire packet: ", roomID, screenID);
      return;
    }
    void deregisterScreen(roomID, Number(screenID));
  });
}
