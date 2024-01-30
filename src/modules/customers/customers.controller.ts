import { Request, Response } from "express";
import { CustomerType, customerSchema } from "../../types";
import { ZodError } from "zod";
import { prisma } from "../../prisma";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { errorHandler } from "../../utils/errorHandler";

export const addCustomer = async (req: Request, res: Response) => {
  try {
    const data: CustomerType = req.body.customer;
    const isCostumerAvailable = await prisma.customer.findUnique({
      where: {
        vat_no: data.vat_no,
      },
    });

    if (isCostumerAvailable) {
      throw new Error("Customer already exists. Check data in the database.");
    }

    const customer = await prisma.customer.create({
      data: {
        ...data,
        address: {
          create: {
            ...data.address,
          },
        },
        contact_person: {
          create: {
            ...data.contact_person,
          },
        },
      },
    });

    console.log("addCustomer - customer: ", customer);

    return res.status(201).send({
      message: "Success! New customer has been added to the system",
    });
  } catch (error) {
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
      message:
        "Unexpected error occurred when adding customer. Try again later.",
    });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const allCustomers = await prisma.customer.findMany({
      include: { address: true, contact_person: true },
    });

    const result = await prisma.$queryRaw`SELECT * FROM "customer"`;

    console.log("result: ", result);

    console.log("allCustomers: ", allCustomers);

    return res.status(200).send(allCustomers);
  } catch (error) {
    errorHandler(error, res);
  }
};
