import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { codeValidation } from "@/lib/utils";
import redis from "@/lib/redis";
import { TRPCError } from "@trpc/server";
import { roomPubSub, roomRoot } from "@/lib/redis-keys";
import { EventEmitter } from "stream";
import { on } from "events";

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
      const pubsubClient = redis.duplicate();
      try {
        await pubsubClient.connect();
        const ee = new EventEmitter();
        await pubsubClient.subscribe(roomPubSub(opts.input.room), (msg) => {
          ee.emit("msg", msg);
        });
        for await (const [msg] of on(ee, "msg")) {
          yield msg;
        }
      } finally {
        await pubsubClient.disconnect();
      }
    }),
});
