import { Request, Response } from "express";
import express from "express";
import {
  activateMember,
  registerMember,
  loginMember,
  authenticateMember,
  logoutMember,
} from "./members.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";

export const membersRouter = express.Router();

membersRouter.post("/", registerMember);
membersRouter.get("/", authenticateToken, authenticateMember);
membersRouter.get("/activate/:activationToken", activateMember);
membersRouter.get("/logoutMember", logoutMember);
membersRouter.post("/login", loginMember);
membersRouter.get("/authenticateMember", authenticateToken, authenticateMember);
