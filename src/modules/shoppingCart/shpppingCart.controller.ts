import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { cartItemSchema } from "../../types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const modifyShoppingCart = async (req: Request, res: Response) => {
  try {
    const currentUser = req.member;
    const cartItem = req.body.cartItem;
    const isProductAvailableInTheSystem = await prisma.product.findUnique({
      where: {
        product_id: cartItem.product_id,
      },
    });

    if (!currentUser) {
      return res
        .status(400)
        .send("It seems user trying to perform action doesn't exists");
    }

    if (!cartItemSchema.safeParse(cartItem).success) {
      return res.status(400).send("Invalid item data send to the server.");
    }

    if (!isProductAvailableInTheSystem) {
      return res
        .status(400)
        .send("This item doesn't exist in the system. Create product first");
    }

    const isShoppingCartAvailable = await prisma.shopping_cart.findUnique({
      where: { user_id: currentUser.user_id },
    });

    if (!isShoppingCartAvailable) {
      await prisma.shopping_cart.create({
        data: {
          user_id: currentUser.user_id,
        },
      });
    }

    const shoppingCart = await prisma.shopping_cart.findUnique({
      where: {
        user_id: currentUser.user_id,
      },
    });

    if (!shoppingCart) {
      return res
        .status(400)
        .send("Shopping cart is not available for this user");
    }

    const cartItemToUpdate = await prisma.cart_item.findUnique({
      where: {
        product_id: cartItem.product_id,
      },
    });

    if (!cartItemToUpdate && cartItem.quantity > 0) {
      await prisma.cart_item.create({
        data: {
          product_id: cartItem.product_id,
          shopping_cart_id: shoppingCart.shopping_cart_id,
          quantity: cartItem.quantity,
        },
      });
    }

    if (cartItemToUpdate && cartItem.quantity > 0) {
      await prisma.cart_item.update({
        where: {
          shopping_cart_id: shoppingCart.shopping_cart_id,
          product_id: cartItem.product_id,
        },
        data: {
          quantity: cartItem.quantity,
        },
      });
    }

    if (cartItemToUpdate && cartItem.quantity <= 0) {
      await prisma.cart_item.delete({
        where: { product_id: cartItem.product_id },
      });
    }

    const updatedShoppingCart = await prisma.cart_item.findMany({
      where: {
        shopping_cart_id: shoppingCart.shopping_cart_id,
      },

      include: {
        product: true,
      },
    });

    return res.status(200).send({
      message: "Shopping cart has been successfully modified",
      data: updatedShoppingCart,
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
export const getShoppingCartProducts = async (req: Request, res: Response) => {
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
