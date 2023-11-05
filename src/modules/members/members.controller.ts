import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { ZodError } from "zod";

import { prisma } from "../../script";
import { transporter } from "../../../src/utils/nodemailer";
import {
  TeamMemberRequestType,
  teamMemberRequestSchema,
} from "./members.schema";

export const registerMember = async (
  req: Request<{}, {}, TeamMemberRequestType>,
  res: Response
) => {
  try {
    teamMemberRequestSchema.parse(req.body);
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = crypto.randomBytes(48).toString("hex");
    const activationLink = `http://localhost:${process.env.DEV_PORT}/api/members/activate/${activationToken}`;
    const userToRegister = await prisma.team_member.findUnique({
      where: {
        email: email,
      },
    });

    if (!userToRegister) {
      await prisma.team_member.create({
        data: {
          email: email,
          password: hashedPassword,
          activate_expire_date: new Date().getTime() + 24 * 3600 * 1000,
          active_token: activationToken,
        },
      });

      await transporter.sendMail({
        from: `John Doe" <${process.env.NODEMAILER_FROM}>`,
        to: email,
        subject: "Customer Register App activation link!",
        text: "Activation link to Customer Register app",
        html: `<p>Hello, click activation link <a href=${activationLink}>here</a> to complete register process</p>`, // html body
      });

      return res
        .status(201)
        .send(
          "The member has been created successfully. Activation link has been sent to your email"
        );
    }

    const isActivateLinkExpired =
      Number(userToRegister.activate_expire_date) < new Date().getTime();

    console.log("isActivateLinkExpired: ", isActivateLinkExpired);

    if (!userToRegister.active && isActivateLinkExpired) {
      return res
        .status(409)
        .send(
          "It seems your activation link has expired. Please register once again"
        );
    }

    return res
      .status(405)
      .send(
        "This email already exists in the database and is currently waiting for activation. Go to your email and click activation link"
      );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(409).send(error.flatten());
    }

    if (error instanceof PrismaClientKnownRequestError) {
      return res.status(409).send(error);
    }

    throw new Error(error);
  }
};

export const activateMember = async (req: Request, res: Response) => {
  try {
    const { activationToken } = req.params;
    const userToActivate = await prisma.team_member.findUnique({
      where: {
        active_token: activationToken,
      },
    });

    if (!userToActivate) {
      return res
        .status(404)
        .send(
          "I am sorry, something went wrong. This user has not been recognized. Please contact support team"
        );
    }

    await prisma.team_member.update({
      where: {
        active_token: activationToken,
      },
      data: {
        active: true,
      },
    });

    return res
      .status(201)
      .send("The user has been activated! You can now log in!");
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return res.status(409).send(error);
    }

    return res
      .status(404)
      .send("Something went wrong. Contact support to get more information");
  }
};
