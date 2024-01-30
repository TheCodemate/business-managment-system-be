import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { ZodError } from "zod";

import { prisma } from "../../prisma";
import { transporter } from "../../../src/utils/nodemailer";
import {
  TeamMemberRequestType,
  teamMemberRequestSchema,
} from "./members.schema";
import { createJWToken } from "../../utils/createJWToken";

export const registerMember = async (req: Request, res: Response) => {
  try {
    teamMemberRequestSchema.parse(req.body);
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = crypto.randomBytes(48).toString("hex");
    const activationLink = `http://localhost:${process.env.DEV_PORT}/api/members/activate/${activationToken}`;
    const userToRegister = await prisma.user_account.findUnique({
      where: {
        email: email,
      },
    });

    if (!userToRegister) {
      await prisma.user_account.create({
        data: {
          email: email,
          password: hashedPassword,
          activate_token_expire_date: new Date().getTime() + 24 * 3600 * 1000,
          activate_token: activationToken,
        },
      });

      await transporter.sendMail({
        from: `John Doe" <${process.env.NODEMAILER_FROM}>`,
        to: email,
        subject: "Customer Register App activation link!",
        text: "Activation link to Customer Register app",
        html: `<p>Hello, click activation link <a href=${activationLink}>here</a> to complete register process</p>`, // html body
      });

      return res.status(201).send({
        message:
          "The member was created successfully. Activation link has been sent to your email. You'll be redirected back to login page.",
      });
    }

    const isActivateLinkExpired =
      Number(userToRegister.activate_token_expire_date) < new Date().getTime();

    if (!userToRegister.active && isActivateLinkExpired) {
      return res
        .status(409)
        .send(
          "It seems your activation link has expired. Please register once again"
        );
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(409).send(error.flatten());
    }

    if (error instanceof PrismaClientKnownRequestError) {
      return res.status(409).send(error);
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error(
      "Unknown error occurred while registering account. Try again later"
    );
  }
};

export const activateMember = async (req: Request, res: Response) => {
  try {
    const { activationToken } = req.params;
    const userToActivate = await prisma.user_account.findUnique({
      where: {
        activate_token: activationToken,
      },
    });

    if (!userToActivate) {
      return res
        .status(404)
        .send(
          "I am sorry, something went wrong. This user has not been recognized. Please contact support team"
        );
    }

    await prisma.user_account.update({
      where: {
        activate_token: activationToken,
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

export const loginMember = async (
  req: Request<TeamMemberRequestType>,
  res: Response
) => {
  const { email, password } = req.body;

  try {
    const userToLogin = await prisma.user_account.findUnique({
      where: {
        email: email,
      },
    });

    if (!userToLogin) {
      return res.status(404).send({
        message: "User doesn't exist. Please create account first",
      });
    }

    const isPasswordTheSame = await bcrypt.compare(
      password,
      userToLogin.password
    );

    if (!isPasswordTheSame) {
      return res
        .status(401)
        .send({ message: "Incorrect password. Please try again" });
    }

    const token = createJWToken({
      user_id: userToLogin.user_id,
      email: userToLogin.email,
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      // domain: "localhost",
      // secure: false,
      // sameSite: "none",
      maxAge: 3600000,
    });

    return res.status(201).send({
      isAuth: true,
      user: {
        id: userToLogin.user_id,
        email: userToLogin.email,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(409).send(error.flatten());
    }

    if (error instanceof PrismaClientKnownRequestError) {
      return res.status(409).send(error.message);
    }

    if (error instanceof Error) {
      return res.status(404).send(error.message);
    }

    return res
      .status(404)
      .send({ message: "Some error happened and nobody knows what happened" });
  }
};

export const authenticateMember = async (req: Request, res: Response) => {
  console.log("authenticateMember - authenticating starts...");
  try {
    if (!req.member) {
      return res.send(403).send("No user found. Check the credentials ");
    }

    return res.status(200).send({
      isAuth: true,
      user: {
        id: req.member.user_id,
        email: req.member.email,
      },
    });
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
};

export const logoutMember = async (req: Request, res: Response) => {
  try {
    res.clearCookie("authToken");
    return res
      .status(201)
      .clearCookie("authToken")
      .send({ isAuth: false, user: null });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(404)
        .send({ message: "Could not log out. Something went wrong" });
    }
    throw new Error();
  }
};

export const resetPasswordRequest = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const resetPassToken = crypto.createHash("sha512").digest("hex");
    const resetLink = `http://localhost:5173/reset-password/${resetPassToken}`;

    const userRequestingPasswordReset = await prisma.user_account.findUnique({
      where: {
        email: email,
      },
    });

    if (!userRequestingPasswordReset) {
      throw new Error("User does not exist");
    }

    const resetTokenExists = await prisma.resetToken.findUnique({
      where: {
        user_id: userRequestingPasswordReset.user_id,
      },
    });

    if (resetTokenExists) {
      return res.status(409).send({
        message:
          "Reset link has been sent to your email already. Please check once again. Make sure it is not in the spam box. If you cannot find your reset email use send reset link again method.",
      });
    }

    await prisma.resetToken.create({
      data: {
        token: resetPassToken,
        token_expire_date: new Date().getTime() + 24 * 3600 * 1000,
        user_id: userRequestingPasswordReset.user_id,
      },
    });

    await transporter.sendMail({
      from: `Customer Register Backend" <${process.env.NODEMAILER_FROM}>`,
      to: email,
      subject: "CRA - reset your password!",
      text: "Reset link",
      html: `<p>Hello, click reset link <a href=${resetLink}>here</a> to complete password reset process</p>`, // html body
    });

    return res.status(201).send({
      message: "Reset link has been sent to given email. ",
    });
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
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, resetToken } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const token = await prisma.resetToken.findUnique({
      where: {
        token: resetToken,
      },
    });

    if (!token) {
      return res.status(404).send({
        message:
          "Reset password token has not been generated yet. Please send password reset request once again.",
      });
    }

    const userRequestingPasswordReset = await prisma.user_account.findUnique({
      where: {
        user_id: token?.user_id,
      },
    });

    if (!userRequestingPasswordReset) {
      return res.status(404).send({
        message:
          "There is no such a user. You cannot reset password of the user that does not exist. Register first.",
      });
    }

    const resetPassword = await prisma.user_account.update({
      where: {
        user_id: userRequestingPasswordReset.user_id,
      },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.resetToken.delete({
      where: {
        user_id: resetPassword.user_id,
      },
    });

    return res.status(201).send({ message: "Password was reset. Login now" });
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
};
