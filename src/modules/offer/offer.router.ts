import express from "express";
import {
  addOffer,
  addProductToOffer,
  deleteOfferProductById,
  getOfferNoteById,
  getOfferProducts,
  getOffers,
  removeOfferById,
  updateOfferById,
  updateOfferNote,
} from "./offer.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";

export const offerRouter = express.Router();

offerRouter.post("/", addOffer);
// offerRouter.post("/", authenticateToken, createOffer);
offerRouter.get("/", getOffers);
// offerRouter.get("/", authenticateToken, getOffers);
offerRouter.put("/", updateOfferById);
// offerRouter.put("/", authenticateToken, updateOffer);
offerRouter.delete("/", removeOfferById);
// offerRouter.delete('/', authenticateToken, removeOffer)
offerRouter.post("/product", addProductToOffer);
offerRouter.get("/product", getOfferProducts);
offerRouter.delete("/product", deleteOfferProductById);
offerRouter.get("/note", getOfferNoteById);
offerRouter.put("/note", updateOfferNote);
