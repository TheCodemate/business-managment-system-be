import express from "express";
import {
  getShoppingCartProducts,
  updateShoppingCartProduct,
  addToCart,
} from "./shpppingCart.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";

export const shoppingCartRouter = express.Router();

shoppingCartRouter.post("/", authenticateToken, addToCart);
shoppingCartRouter.get("/", authenticateToken, getShoppingCartProducts);
shoppingCartRouter.put("/", updateShoppingCartProduct);
