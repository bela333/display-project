import { type RedisClientType } from "redis";
import { deregisterScreen } from "../room/[id]/view/_actions/screenRegistration";

const screenKeyRegex = /^room:([^:]+):screen:(\d+):ping$/;

export async function setupScreenExpiry(redis: RedisClientType) {
  await redis.configSet("notify-keyspace-events", "Ex");
  const listener = redis.duplicate();
  await listener.connect();
  void listener.subscribe("__keyevent@0__:expired", (key) => {
    console.log(key);
    const matches = key.match(screenKeyRegex);
    if (matches === null) {
      return;
    }
    const roomID = matches[1];
    const screenID = matches[2];
    if (!roomID || !screenID) {
      console.log("Invalid expire packet: ", roomID, screenID);
      return;
    }
    void deregisterScreen(roomID, Number(screenID));
  });
}
