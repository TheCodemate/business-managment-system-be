import { Request, Response } from "express";
import {
  Decimal,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { ZodError } from "zod";

import { prisma } from "../../prisma";
import { transporter } from "../../utils/nodemailer";
import { createJWToken } from "../../utils/createJWToken";
import { OrderItemRequestType, ShippingAddressRequestType } from "src/types";
import { connect } from "http2";

export const placeOrder = async (req: Request, res: Response) => {
  const user = req.member;

  const {
    shippingAddress: {
      email,
      address,
      company,
      apartment_number,
      country,
      city,
      postal_code,
      first_name,
      last_name,
      phone_number,
      note,
    },
    orderItems,
  }: {
    shippingAddress: ShippingAddressRequestType;
    orderItems: OrderItemRequestType[];
  } = req.body;

  if (!user) {
    return res
      .status(401)
      .send({ message: "Could not perform action. Try login again" });
  }

  const openOrder = await prisma.orderDetails.findMany({
    where: {
      userAccountId: user.user_id,
      isConfirmed: false,
    },
  });

  if (openOrder) {
    return res.status(200).send(openOrder);
  }

  // const userOrderDetails = await prisma.orderDetails.upsert({
  //   where: {
  //     userAccountId: user.user_id,
  //     is_confirmed: false,
  //   },
  //   update: {
  //     order_items: {
  //       updateMany: {
  //         data:

  //       }
  //     }
  //   },
  //   create: {
  //     userAccountId: user.user_id,
  //     order_note: {
  //       create: {
  //         note: note
  //       }
  //       },
  //     },
  //   },
  // });
  // const userOrderDetails = await prisma.orderDetails.create({
  //   data: {
  //     order_items: {
  //       create: orderItems,
  //     },
  //     userAccount: {
  //       connect: {
  //         user_id: user.user_id,
  //       },
  //     },
  //     order_note: {
  //       create: {
  //         note: note,
  //       },
  //     },
  //     shipping_address: {
  //       create: {
  //         company,
  //         apartment_number,
  //         country,
  //         city,
  //         address,
  //         postal_code: Number(postal_code),
  //         shipping_contact: {
  //           create: {
  //             phone_number,
  //             first_name,
  //             last_name,
  //             email,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  // console.log("userOrderDetails - ", userOrderDetails);

  // if (!userOrderDetails) {
  //   return res.status(401).send({
  //     message: "Something went wrong. Try again later",
  //   });
  // }

  return res.status(201).send({
    message: "Shipping address has been added",
    // order_id: userOrderDetails.order_id,
  });
};

export const getShippingAddress = async (req: Request, res: Response) => {
  const { order_id } = req.query;

  if (typeof order_id !== "string") {
    return res.status(400).send({ message: "Could not get data" });
  }

  const order = await prisma.orderDetails.findUnique({
    where: {
      orderDetailsId: order_id,
    },
    select: {
      shippingAddress: true,
    },
  });

  if (!order) {
    return res.status(400).send({ message: "Could not get data" });
  }

  return res.status(200).send({
    order,
  });
};

export const getOrderDetails = async (req: Request, res: Response) => {
  const currentOrder = await prisma.orderDetails.findUnique({
    where: {
      userAccountId: req.member?.user_id,
    },
  });

  return res.status(200).send({
    currentOrder,
  });
};
