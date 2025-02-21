import { z } from "zod";

//TODO: Find better name
const screenConfigZod = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  x: z.number().nonnegative(),
  y: z.number().nonnegative(),
});

export type ScreenConfig = z.infer<typeof screenConfigZod>;

export { screenConfigZod };
