import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { membersRouter } from "./modules/members/members.router";
import { customersRouter } from "./modules/customers/customers.router";
import { shoppingCartRouter } from "./modules/shoppingCart/shoppingCart.router";
import { productsRouter } from "./modules/products/products.router";
import { ordersRouter } from "./modules/orders/orders.router";
import { supportRequestRouter } from "./modules/requests/requests.v1.router";
import { offerRouter } from "./modules/offer/offer.router";

dotenv.config();

export const app: Express = express();

app.use(helmet());
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

app.use("/api/customers", customersRouter);
app.use("/api/members", membersRouter);
app.use("/api/shopping-cart", shoppingCartRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/support-requests", supportRequestRouter);
app.use("/api/offer", offerRouter);
