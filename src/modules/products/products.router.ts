import express from "express";
import {
  getProductById,
  getProducts,
  getSearchedProducts,
  getUploadedProducts,
  uploadProducts,
} from "./products.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";

export const productsRouter = express.Router();

// productsRouter.get("/", authenticateToken, getProducts);
productsRouter.get("/", getProducts);
// productsRouter.get("/product", authenticateToken, getProductById);
productsRouter.get("/product", getProductById);
// productsRouter.post("/upload", authenticateToken, uploadProducts);
productsRouter.post("/upload", uploadProducts);
productsRouter.get("/upload", getUploadedProducts);
productsRouter.get("/searched", getSearchedProducts);
