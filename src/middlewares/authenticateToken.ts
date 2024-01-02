import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { isMember } from "../utils/isMember";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res
      .status(403)
      .send("It seems your authorization code has expired. Please login again");
  }

  const member = jwt.verify(
    accessToken,
    process.env.JWT_SECRET ||
      "some random secret just in case the one in .env has not been set up"
  );

  if (!req.member) {
    if (isMember(member)) {
      req.member = member;
    }
  }

  next();
};
