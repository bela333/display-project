import "server-only";
import "redis";
import { createClient } from "redis";
import { setupScreenExpiry } from "./_setupScreenExpiry";

const redis = createClient({
  url: process.env.REDIS_URL,
});

await redis.connect();

await setupScreenExpiry(redis);

export default redis;
