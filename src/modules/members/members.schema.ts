import { z } from "zod";

const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const teamMemberRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().refine((password) => passwordRegex.test(password), {
    message:
      "Password must have at least 8 characters, one lowercase letter, one uppercase letter, one number, and one special character.",
  }),
});

export type TeamMemberRequestType = z.infer<typeof teamMemberRequestSchema>;
