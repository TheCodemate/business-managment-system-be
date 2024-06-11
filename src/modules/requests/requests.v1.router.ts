import express, { Request, Response } from "express";
import multer from "multer";
import {
  RequestDTO,
  assignTechnicalRequest,
  getTechnicalRequestResponseById,
  getTechnicalRequests,
  getTechnicalRequestsById,
  postResponse,
  removeFile,
  unassignUserFromTechnicalRequest,
  uploadRequestFile,
} from "./requests.v1.controller";
import { postTechnicalRequests } from "./requests.v1.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";
import { MemberType } from "src/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const upload = multer({ dest: "uploads/" });

export const supportRequestRouter = express.Router();
supportRequestRouter.post(
  "/",
  authenticateToken,
  async (req: Request & { member: MemberType }, res: Response) => {
    try {
      const response = await postTechnicalRequests(
        req.member.user_id,
        RequestDTO.fromBody(req.body)
      );

      return res.status(200).send({ message: "Request posted successfully" });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(409).send(error.message);
      }

      if (error instanceof Error) {
        return res.status(404).send(error.message);
      }

      return res.status(404).send({
        message:
          "Could not get requested resources. Some unknown error has occurred",
      });
    }
  }
);
supportRequestRouter.post(
  "/upload-file",
  upload.single("uploadedFile"),
  uploadRequestFile
);
supportRequestRouter.delete("/upload-file", removeFile);
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

supportRequestRouter.post("/response", authenticateToken, postResponse);
supportRequestRouter.get(
  "/response",
  authenticateToken,
  getTechnicalRequestResponseById
);
