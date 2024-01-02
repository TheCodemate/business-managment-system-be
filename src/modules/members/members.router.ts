import express from "express";
import {
  activateMember,
  registerMember,
  loginMember,
  getAllMembers,
  authenticateMember,
} from "./members.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";

export const membersRouter = express.Router();

membersRouter.post("/", registerMember);
membersRouter.get("/", getAllMembers);
membersRouter.get("/activate/:activationToken", activateMember);
membersRouter.post("/login", loginMember);
membersRouter.get("/authenticateMember", authenticateToken, authenticateMember);
