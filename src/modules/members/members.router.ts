import express from "express";
import { activateMember, registerMember } from "./members.controller";

export const membersRouter = express.Router();

membersRouter.post("/", registerMember);
membersRouter.get("/activate/:activationToken", activateMember);
