import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).send(products);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return res.status(409).send(error.message);
    }

    if (error instanceof Error) {
      return res.status(404).send(error.message);
    }

    return res.status(404).send({
      message:
        "Could not get requested resources. Some unknown error has occurred",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.query.productId?.toString();

    const product = await prisma.product.findUnique({
      where: { productId: productId },
    });

    return res.status(200).send(product);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return res.status(409).send(error.message);
    }

    if (error instanceof Error) {
      return res.status(404).send(error.message);
    }

    return res.status(404).send({
      message:
        "Could not get requested resources. Some unknown error has occurred",
    });
  }
};
