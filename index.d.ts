import { MemberType, UserType } from "./src/types";

declare global {
  declare namespace Express {
    export interface Request {
      member: MemberType | undefined;
    }
  }
}
