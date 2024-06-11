import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
//@ts-ignore
import Fuse from "fuse.js";
import { UploadedProductType } from "src/types";

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
    console.log(">>>>>>>>>>>>> getting product: ", productId);

    const product = await prisma.uploadedProduct.findUnique({
      where: { uploadedProductId: productId },
    });

    console.log(">>>>>>>>>>>>> received product: ", product);
    return res.status(200).send(product);
  } catch (error) {
    //@ts-ignore
    console.log("getProductById - ERROR - XXXXXX: ", error?.message);
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

class DTOUploadedProduct {
  collectionName: string = "";
  productName: string = "";
  eanCode: string = "";
  productCode: string = "";
  finish?: string = "";
  format: string = "";
  weight: number = 0;
  M2xPKG: number = 0;
  PCxPKG: number = 0;
  M2xPLT: number = 0;
  unit: string = "";
  color: string = "";
  producer: string = "";
  category: string = "";

  static formattedData(data: Record<string, string>) {
    const formattedBody = new DTOUploadedProduct();

    formattedBody.collectionName = data.collectionName;
    formattedBody.productName = data.productName;
    formattedBody.eanCode = String(data.eanCode);
    formattedBody.productCode = String(data.productCode);
    formattedBody.finish = data.finish;
    formattedBody.format = data.format;
    formattedBody.weight = Number(data.weight);
    formattedBody.M2xPKG = Number(data.M2xPKG);
    formattedBody.PCxPKG = Number(data.PCxPKG);
    formattedBody.M2xPLT = Number(data.M2xPLT);
    formattedBody.unit = data.unit;
    formattedBody.color = data.color;
    formattedBody.producer = data.producer;
    formattedBody.category = data.category;

    return formattedBody;
  }
}

export const uploadProducts = async (req: Request, res: Response) => {
  const { products } = req.body;

  console.log("uploading...");

  try {
    const formattedProducts = products.map((product: Record<string, string>) =>
      DTOUploadedProduct.formattedData(product)
    );

    const createdProducts = await prisma.uploadedProduct.createMany({
      data: formattedProducts,
      skipDuplicates: true,
    });

    console.log("uploaded");
    return res.status(200).send("Products uploaded");
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error);
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

export const getUploadedProducts = async (req: Request, res: Response) => {
  try {
    const uploadedProducts = await prisma.uploadedProduct.findMany();
    return res.status(200).send(uploadedProducts);
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error);
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
export const getSearchedProducts = async (req: Request, res: Response) => {
  try {
    const { searchPhrase } = req.query;
    const uploadedProducts = await prisma.uploadedProduct.findMany();

    const convertedProducts = uploadedProducts.map((product) => ({
      ...product,
      searchedPhrase: `${product.producer} ${product.collectionName} ${
        product.productName
      } ${product.color} ${product.format} ${
        product.productCode ? product.productCode : ""
      }`,
    }));

    //@ts-ignore
    const convertedPhrase = searchPhrase
      //@ts-ignore
      ?.split(" ")
      .map((phrase: string) => `'${phrase}`)
      .join(" ")
      .trim();

    console.log("converted phrase: ", convertedPhrase);

    const fuse = new Fuse(convertedProducts, {
      shouldSort: true,
      minMatchCharLength: 2,
      includeMatches: true,
      includeScore: true,
      ignoreLocation: true,
      useExtendedSearch: true,
      findAllMatches: true,
      threshold: 0.2,
      keys: [{ name: "searchedPhrase", weight: 2 }],
    });

    const searchedItems = fuse.search(convertedPhrase, { limit: 10 });

    return res.status(200).send(searchedItems);
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error);
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
