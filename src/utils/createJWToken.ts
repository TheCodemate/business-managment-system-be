import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createJWToken = ({ id, email }: { id: number; email: string }) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET ||
      "some random secret just in case the one in .env has not been set up"
  );
};
