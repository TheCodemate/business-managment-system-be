import { z } from "zod";

export const memberSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});

export type MemberType = z.infer<typeof memberSchema>;
