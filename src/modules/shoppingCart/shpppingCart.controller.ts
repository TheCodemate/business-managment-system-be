import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import { CartItemType, cartItemSchema } from "../../types";
import { ZodError } from "zod";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.member?.user_id;
    const cartItem: CartItemType = req.body;

    if (!cartItemSchema.parse(cartItem)) {
      return res
        .status(422)
        .send({ message: "Unrecognized product. Request unsuccessful" });
    }

    const shoppingCart = await prisma.shoppingCart.upsert({
      where: {
        userId: userId,
      },
      update: {},
      create: {
        userId: userId,
      },
    });

    const currentCartItem = await prisma.cartItem.findUnique({
      where: {
        productId: cartItem.product_id,
        shoppingCartId: shoppingCart.shoppingCartId,
      },
    });

    const product = await prisma.product.findUnique({
      where: { productId: cartItem.product_id },
    });

    const addQuantity = (qaToAdd: number) => {
      if (!currentCartItem || !product) return new Prisma.Decimal(0);
      const currentCartItemQA = currentCartItem.quantity.toNumber();
      const availableStock = product.stockAmount;

      if (qaToAdd + currentCartItemQA > availableStock) {
        return new Prisma.Decimal(
          currentCartItemQA + (availableStock - currentCartItemQA)
        );
      }

      return new Prisma.Decimal(qaToAdd + currentCartItemQA).toFixed(2);
    };

    const newCartItem = await prisma.cartItem.upsert({
      where: {
        productId: cartItem.product_id,
        shoppingCartId: shoppingCart?.shoppingCartId,
      },
      update: {
        quantity: addQuantity(cartItem.quantity),
      },
      create: {
        productId: cartItem.product_id,
        shoppingCartId: shoppingCart.shoppingCartId,
        quantity: cartItem.quantity,
      },
    });

    const cart = await prisma.shoppingCart.findUnique({
      where: {
        shoppingCartId: shoppingCart.shoppingCartId,
      },
      select: {
        cartItems: true,
      },
    });

    const items = cart?.cartItems.map((item) => {
      return item.productId;
    });

    return res.status(200).send({
      messaged: "Product has been added to shopping cart.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(422)
        .send({ message: "Unrecognized product. Request unsuccessful" });
    }
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

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.member?.user_id;
    const cartItem: CartItemType = req.body.cartItem;

    if (!cartItemSchema.parse(cartItem)) {
      return res
        .status(422)
        .send({ message: "Unrecognized product. Request unsuccessful" });
    }

    const shoppingCart = await prisma.shoppingCart.upsert({
      where: {
        userId: userId,
      },
      update: {},
      create: {
        userId: userId,
      },
    });

    const currentCartItem = await prisma.cartItem.findUnique({
      where: {
        productId: cartItem.product_id,
        shoppingCartId: shoppingCart.shoppingCartId,
      },
    });

    const product = await prisma.product.findUnique({
      where: { productId: cartItem.product_id },
    });

    const removeQuantity = (qaToRemove: number) => {
      if (!currentCartItem || !product) return new Prisma.Decimal(0);
      const currentCartItemQA = currentCartItem.quantity.toNumber();
      const availableStock = product.stockAmount;

      if (currentCartItemQA - qaToRemove < 0) {
        return new Prisma.Decimal(currentCartItemQA - currentCartItemQA);
      }
      return new Prisma.Decimal(currentCartItemQA - qaToRemove);
    };

    const newCartItem = await prisma.cartItem.upsert({
      where: {
        productId: cartItem.product_id,
        shoppingCartId: shoppingCart?.shoppingCartId,
      },
      update: {
        quantity: removeQuantity(cartItem.quantity),
      },
      create: {
        productId: cartItem.product_id,
        shoppingCartId: shoppingCart.shoppingCartId,
        quantity: cartItem.quantity,
      },
    });

    return res.status(200).send({
      messaged: "Product has been added to shopping cart.",
    });
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

export const getProductsInCart = async (req: Request, res: Response) => {
  try {
    const userId = req.member?.user_id;
    const shoppingCart = await prisma.shoppingCart.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!shoppingCart?.shoppingCartId) {
      return res.status(404).send("Could not get shopping cart");
    }

    const shoppingCartItems = await prisma.cartItem.findMany({
      where: {
        shoppingCartId: shoppingCart?.shoppingCartId,
      },
      include: {
        product: true,
      },
    });

    return res.status(200).send(shoppingCartItems);
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

export const deleteFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.member?.user_id;
    const cartItemId = req.body.cartItemId;
    const shoppingCart = await prisma.shoppingCart.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!shoppingCart) {
      return res.status(404).send("Could not get shopping cart");
    }
    const shoppingCartItems = await prisma.cartItem.delete({
      where: {
        cartItemId: cartItemId,
      },
    });

    return res.status(200).send(shoppingCartItems);
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

export const updateShoppingCartProduct = (req: Request, res: Response) => {
  return res.status(200).send({ message: "put updateShoppingCartProduct" });
};
