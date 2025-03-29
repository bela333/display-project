import "server-only";
import "redis";
import { createClient } from "redis";
import { setupScreenExpiry } from "./setupScreenExpiry";
import { type RedisClientType } from "@redis/client";

let redisSingleton: Promise<RedisClientType> | undefined;

function getRedis() {
  return (redisSingleton ??= (async () => {
    const redis: RedisClientType = createClient({
      url: process.env.REDIS_URL,
    });

    await redis.connect();
    await setupScreenExpiry(redis);
    return redis;
  })());
}

export default getRedis;
