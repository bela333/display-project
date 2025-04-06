import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { codeValidation } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { EventEmitter } from "stream";
import { on } from "events";
import { roomPubSub } from "@/db/redis-keys";
import { serializeRoom } from "@/db/serialization";
import roomRootObject from "@/db/objects/roomRoot";
import getRedis from "@/db/redis";

export const roomRouter = createTRPCRouter({
  roomEvents: publicProcedure
    .input(
      z.object({
        room: codeValidation(),
      })
    )
    .subscription(async function* (opts) {
      if (!(await roomRootObject.exists(opts.input.room))) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "This room does not exist",
        });
      }

      yield serializeRoom(opts.input.room);

      const pubsubClient = (await getRedis()).duplicate();
      try {
        await pubsubClient.connect();
        const ee = new EventEmitter();
        await pubsubClient.subscribe(roomPubSub(opts.input.room), (msg) => {
          ee.emit("msg", msg);
        });
        for await (const [msg] of on(ee, "msg", {
          signal: opts.signal,
        })) {
          if (msg === "ping") {
            yield serializeRoom(opts.input.room);
          }
        }
      } finally {
        await pubsubClient.disconnect();
      }
    }),
});
