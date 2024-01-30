import express from "express";
import {
  modifyShoppingCart,
  getShoppingCartProducts,
  updateShoppingCartProduct,
} from "./shpppingCart.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";

export const shoppingCartRouter = express.Router();

shoppingCartRouter.post("/", authenticateToken, modifyShoppingCart);
shoppingCartRouter.get("/", authenticateToken, getShoppingCartProducts);
shoppingCartRouter.put("/", updateShoppingCartProduct);
