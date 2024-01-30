import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createJWToken = ({
  user_id,
  email,
}: {
  user_id: string;
  email: string;
}) => {
  return jwt.sign(
    { user_id, email },
    process.env.JWT_SECRET ||
      "some random secret just in case the one in .env has not been set up"
  );
};
