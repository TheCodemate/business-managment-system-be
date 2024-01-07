import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { isMember } from "../utils/isMember";

import { MemberType } from "../types";

declare global {
  namespace Express {
    export interface Request {
      member: MemberType | undefined;
      accessToken: string;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessTokenCookie = req.cookies.authToken;

  if (!accessTokenCookie) {
    return res.status(403).send({
      message:
        "It seems your authorization code has expired. Please login again",
    });
  }

  const member = jwt.verify(
    accessTokenCookie,
    process.env.JWT_SECRET ||
      "some random secret just in case the one in .env has not been set up"
  );

  if (!member) {
    return res
      .status(403)
      .send({ message: "You couldnt be authorized. Login again" });
  }

  if (isMember(member)) {
    req.member = member;
  }

  next();
};
