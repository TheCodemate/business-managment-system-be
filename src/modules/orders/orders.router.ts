import express from "express";
import {
  getShippingAddress,
  getOrderDetails,
  placeOrder,
} from "./orders.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";

export const ordersRouter = express.Router();

ordersRouter.post("/place-order", authenticateToken, placeOrder);
ordersRouter.get(
  "/get-shipping-address",
  authenticateToken,
  getShippingAddress
);
ordersRouter.get("/get-order-details", authenticateToken, getOrderDetails);
