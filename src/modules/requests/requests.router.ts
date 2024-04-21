import express from "express";
import {
  assignTechnicalRequest,
  getTechnicalRequests,
  getTechnicalRequestsById,
  postTechnicalRequests,
  unassignUserFromTechnicalRequest,
} from "./requests.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";

export const supportRequestRouter = express.Router();
supportRequestRouter.post("/", authenticateToken, postTechnicalRequests);
supportRequestRouter.get("/", authenticateToken, getTechnicalRequests);
supportRequestRouter.post(
  "/assign-user",
  authenticateToken,
  assignTechnicalRequest
);
supportRequestRouter.delete(
  "/unassign-user",
  authenticateToken,
  unassignUserFromTechnicalRequest
);
supportRequestRouter.get(
  "/request-by-id",
  authenticateToken,
  getTechnicalRequestsById
);
