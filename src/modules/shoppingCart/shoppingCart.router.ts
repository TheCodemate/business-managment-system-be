import express from "express";
import {
  getProductsInCart,
  addToCart,
  removeFromCart,
  deleteFromCart,
} from "./shpppingCart.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";

export const shoppingCartRouter = express.Router();

shoppingCartRouter.post("/add-to-cart", authenticateToken, addToCart);
shoppingCartRouter.post("/remove-from-cart", authenticateToken, removeFromCart);
shoppingCartRouter.post("/delete-cart-item", authenticateToken, deleteFromCart);
shoppingCartRouter.get("/", authenticateToken, getProductsInCart);
