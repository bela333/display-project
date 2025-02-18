import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { codeValidation } from "@/lib/utils";
import redis from "@/app/db/redis";
import { TRPCError } from "@trpc/server";
import {
  roomMode,
  roomPubSub,
  roomRoot,
  roomScreenAvailable,
  roomScreenCount,
  screenConfig,
} from "@/app/db/redis-keys";
import { EventEmitter } from "stream";
import { on } from "events";
import { type ScreenConfig, screenConfigZod } from "@/lib/screenConfig";

export type ScreenLocal = ScreenConfig & {
  id: string;
};

export type Modes = "calibration" | "viewing";

export type SerializedRoom = {
  screenCount: number;
  screenLocals: ScreenLocal[];
  mode: Modes;
};

const serialize = async (room: string): Promise<SerializedRoom> => {
  const screenCount = await redis.get(roomScreenCount(room));

  const screens = await redis.sMembers(roomScreenAvailable(room));

  const screenLocals = (
    await Promise.all(
      screens.map<Promise<ScreenLocal | null>>(async (screen) => {
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
  ).filter((a) => a !== null);

  const mode = await redis.get(roomMode(room));
  if (mode !== "viewing" && mode !== "calibration") {
    throw new Error(`Invalid mode: ${mode}`);
  }

  return {
    screenCount: Number(screenCount),
    screenLocals: screenLocals,
    mode,
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
      console.log("Connect!");
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
        console.log("Disconnect!");
        await pubsubClient.disconnect();
      }
    }),
});
