import express from "express";
import { addCustomer, getCustomers } from "./customers.controller";

export const customersRouter = express.Router();

customersRouter.get("/", getCustomers);
customersRouter.post("/add-customer", addCustomer);
