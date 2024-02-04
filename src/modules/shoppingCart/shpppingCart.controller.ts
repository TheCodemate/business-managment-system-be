import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import { CartItemType, cartItemSchema } from "../../types";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.member?.user_id;
    const cartItem: CartItemType = req.body.cartItem;

    if (!cartItemSchema.parse(cartItem)) {
      return res
        .status(422)
        .send({ message: "Unrecognized product. Request unsuccessful" });
    }

    const shoppingCart = await prisma.shopping_cart.upsert({
      where: {
        user_id: userId,
      },
      update: {},
      create: {
        user_id: userId,
      },
    });

    const currentCartItem = await prisma.cart_item.findUnique({
      where: {
        product_id: cartItem.product_id,
        shopping_cart_id: shoppingCart.shopping_cart_id,
      },
    });

    const product = await prisma.product.findUnique({
      where: { product_id: cartItem.product_id },
    });

    const addQuantity = (qaToAdd: number) => {
      if (!currentCartItem || !product) return new Prisma.Decimal(0);
      const currentCartItemQA = currentCartItem.quantity.toNumber();
      const availableStock = product.stock_amount;

      if (qaToAdd + currentCartItemQA > availableStock) {
        return new Prisma.Decimal(
          currentCartItemQA + (availableStock - currentCartItemQA)
        );
      }

      return new Prisma.Decimal(qaToAdd + currentCartItemQA);
    };

    const newCartItem = await prisma.cart_item.upsert({
      where: {
        product_id: cartItem.product_id,
        shopping_cart_id: shoppingCart?.shopping_cart_id,
      },
      update: {
        quantity: addQuantity(cartItem.quantity),
      },
      create: {
        product_id: cartItem.product_id,
        shopping_cart_id: shoppingCart.shopping_cart_id,
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
    const shoppingCart = await prisma.shopping_cart.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!shoppingCart?.shopping_cart_id) {
      return res.status(404).send("Could not get shopping cart");
    }

    const shoppingCartItems = await prisma.cart_item.findMany({
      where: {
        shopping_cart_id: shoppingCart?.shopping_cart_id,
      },
      include: {
        product: true,
      },
    });

    return res.status(200).send(shoppingCartItems);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.log("error: ", error.message);
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
