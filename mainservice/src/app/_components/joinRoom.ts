"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { codeValidation } from "@/lib/utils";
import roomRootObject from "@/db/objects/roomRoot";

const schema = z.object({
  code: codeValidation(),
});

export async function joinRoom(_: unknown, data: FormData) {
  const validatedFields = schema.safeParse({
    code: data.get("code"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const code = validatedFields.data.code.toLowerCase();

  if (!(await roomRootObject.exists(code))) {
    return {
      errors: {
        code: ["Invalid code"],
      },
    };
  }

  redirect(`/room/${code}/config`);
  return;
}
