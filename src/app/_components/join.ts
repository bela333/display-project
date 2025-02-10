"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import redis from "@/lib/redis";

const schema = z.object({
  code: z.string().length(6),
});

export async function join(_, data: FormData) {
  const validatedFields = schema.safeParse({
    code: data.get("code"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // TODO: Check if room actually exists
  //await redis.set(`room:${validatedFields.data.code}`, 3);

  redirect(`/room/${validatedFields.data.code}/config`);
  return;
}
