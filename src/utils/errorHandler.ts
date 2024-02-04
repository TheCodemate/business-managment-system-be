import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    return res.status(403).send({ message: error.message });
  }
  if (error instanceof PrismaClientKnownRequestError) {
    return res.status(422).send({
      message: error.message,
    });
  }
  if (error instanceof PrismaClientUnknownRequestError) {
    return res.status(422).send({
      message: error.message,
    });
  }
  if (error instanceof PrismaClientValidationError) {
    return res.status(422).send({
      message: error.message,
    });
  }
  if (error instanceof ZodError) {
    return res.status(422).send({
      message: error.message,
    });
  }

  return res.status(400).send({
    message: "Unexpected error occurred when adding customer. Try again later.",
  });
};
