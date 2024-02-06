import express from "express";
import { getProductById, getProducts } from "./products.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";

export const productsRouter = express.Router();

productsRouter.get("/", authenticateToken, getProducts);
productsRouter.get("/product", authenticateToken, getProductById);
