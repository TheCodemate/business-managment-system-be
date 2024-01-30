import { MemberType, memberSchema } from "../types";

export const isMember = (value: unknown): value is MemberType =>
  memberSchema.safeParse(value).success;
