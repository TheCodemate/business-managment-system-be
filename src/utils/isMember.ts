import { MemberType, memberSchema } from "../types";

export const isMember = (value: unknown): value is MemberType => {
  return memberSchema.safeParse(value).success;
};
