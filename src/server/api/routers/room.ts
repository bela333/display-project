import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { codeValidation } from "@/lib/utils";
import redis from "@/lib/redis";
import { TRPCError } from "@trpc/server";
import {
  roomPubSub,
  roomRoot,
  roomScreenAvailable,
  roomScreenCount,
  screenConfig,
} from "@/lib/redis-keys";
import { EventEmitter } from "stream";
import { on } from "events";
import { screenConfigZod } from "@/lib/screenConfig";

const serialize = async (room: string) => {
  const screenCount = await redis.get(roomScreenCount(room));

  const screens = await redis.sMembers(roomScreenAvailable(room));

  const configs = (
    await Promise.all(
      screens.map(async (screen) => {
        const config = await redis.get(screenConfig(room, Number(screen)));
        if (!config) {
          return null;
        }
        const result = await screenConfigZod.safeParseAsync(JSON.parse(config));
        if (!result.success) {
          return null;
        }
        return { ...result.data, id: screen };
      })
    )
  ).filter((a) => a);

  return {
    screenCount: Number(screenCount),
    screens: configs,
  };
};

export const roomRouter = createTRPCRouter({
  roomEvents: publicProcedure
    .input(
      z.object({
        room: codeValidation(),
      })
    )
    .subscription(async function* (opts) {
      if (!(await redis.get(roomRoot(opts.input.room)))) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "This room does not exist",
        });
      }

      yield serialize(opts.input.room);

      const pubsubClient = redis.duplicate();
      try {
        await pubsubClient.connect();
        const ee = new EventEmitter();
        await pubsubClient.subscribe(roomPubSub(opts.input.room), (msg) => {
          ee.emit("msg", msg);
        });
        for await (const [msg] of on(ee, "msg")) {
          if (msg === "ping") {
            yield serialize(opts.input.room);
          }
        }
      } finally {
        await pubsubClient.disconnect();
      }
    }),
});
