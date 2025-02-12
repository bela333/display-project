"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import redis from "@/lib/redis";
import { CODE_LENGTH, CODE_REGEX } from "@/lib/consts";

const schema = z.object({
  code: z.string().length(CODE_LENGTH).regex(CODE_REGEX),
});

export async function joinRoom(_, data: FormData) {
  const validatedFields = schema.safeParse({
    code: data.get("code"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const code = validatedFields.data.code.toLowerCase();

  if (!(await redis.exists(`room:${code}`))) {
    return {
      errors: {
        code: ["Invalid code"],
      },
    };
  }

  redirect(`/room/${code}/config`);
  return;
}
