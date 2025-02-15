import { z } from "zod";

//TODO: Find better name
const screenConfigZod = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  x: z.number().nonpositive(),
  y: z.number().nonpositive(),
});

export type ScreenConfig = z.infer<typeof screenConfigZod>;

export { screenConfigZod };
