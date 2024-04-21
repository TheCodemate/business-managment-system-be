import { prisma } from "../../prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import {
  TechnicalRequestResponseSchema,
  technicalRequestRequestSchema,
  technicalRequestTypeSchema,
} from "../../types";
import { connect } from "http2";
import { TechnicalRequestRequestType } from "@prisma/client";

type RequestTypes =
  | "price"
  | "priceNet"
  | "availability"
  | "technicalDocumentation";

class RequestDTO {
  requestTypes: RequestTypes[] = ["price"];
  productCategory: string = "";
  additionalInfo: string | undefined;
  files: string | undefined;
  contactPerson: string = "";
  contactPersonPhone: string = "";
  contactPersonEmail: string = "";
  collectionName: string = "";
  productCode: string = "";
  width: number = 0;
  height: number = 0;
  thickness: number = 0;
  producer: string = "";
  color: string = "";
  quantity: string = "";
  finish: string = "";

  static fromBody(body: Record<string, any>) {
    const newRequest = new RequestDTO();

    newRequest.requestTypes = body.requestTypes;
    newRequest.productCategory = body.productCategory;
    newRequest.additionalInfo = body.additionalInfo;
    newRequest.files = body.files;
    newRequest.contactPerson = body.contactPerson;
    newRequest.contactPersonPhone = body.contactPersonPhone;
    newRequest.contactPersonEmail = body.contactPersonEmail;
    newRequest.collectionName = body.collectionName;
    newRequest.productCode = body.productCode;
    newRequest.width = Number(body.width);
    newRequest.height = Number(body.height);
    newRequest.thickness = Number(body.thickness);
    newRequest.producer = body.producer;
    newRequest.color = body.color;
    newRequest.finish = body.finish;
    newRequest.quantity = body.quantity;
    return newRequest;
  }
}

export const postTechnicalRequests = async (req: Request, res: Response) => {
  try {
    const transformedBody = RequestDTO.fromBody(req.body);
    if (!technicalRequestRequestSchema.parse(transformedBody)) {
      return res
        .status(422)
        .send({ message: "Incorrect request data. Request unsuccessful" });
    }

    const availableRequestTypes = await prisma.technicalRequestType.findMany();

    await prisma.technicalRequest.create({
      data: {
        ...transformedBody,
        userAccountId: req.member.user_id,
        requestStatusId: 1,
        requestTypes: {
          create: transformedBody.requestTypes.map((typeName) => ({
            technicalRequestType: {
              connect: {
                typeId: availableRequestTypes.find(
                  (requestType) => requestType.typeName === typeName
                )?.typeId,
              },
            },
          })),
        },
      },
    });

    const technicalRequest = await prisma.technicalRequest.findMany({
      where: { userAccountId: req.member.user_id },
      include: {
        requestStatus: true,
        requestTypes: true,
        assignees: {
          include: {
            userAccount: true,
          },
        },
      },
    });

    return res
      .status(200)
      .send({ message: "Request posted successfully", data: technicalRequest });
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

export const getTechnicalRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.technicalRequest.findMany({
      include: {
        userAccount: {
          select: {
            email: true,
            userId: true,
          },
        },
        requestTypes: {
          include: {
            technicalRequestType: {
              select: {
                typeName: true,
              },
            },
          },
        },
        requestStatus: {
          select: {
            technicalRequestStatusName: true,
          },
        },
        assignees: {
          select: {
            userAccount: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    const sortedRequests = requests.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.status(200).send(sortedRequests);
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

export const getTechnicalRequestsById = async (req: Request, res: Response) => {
  try {
    const { requestId: id } = req.query;

    const request = await prisma.technicalRequest.findUnique({
      where: {
        technicalRequestId: String(id),
      },
      include: {
        requestTypes: {
          select: {
            technicalRequestType: true,
          },
        },
        requestStatus: {
          select: {
            technicalRequestStatusName: true,
          },
        },

        assignees: {
          select: {
            userAccount: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).send(request);
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

export const assignTechnicalRequest = async (
  req: Request<{ requestId: string; assignedToId: string }>,
  res: Response
) => {
  try {
    const { requestId, assignedToId } = req.body;

    if (!assignedToId) {
      return res.status(404).send("testing...");
    }

    await prisma.technicalRequestUser.create({
      data: {
        technicalRequestId: requestId,
        userAccountId: assignedToId,
      },
    });

    const allRequests = await prisma.technicalRequest.findMany({
      where: { userAccountId: req.member.user_id },
      include: {
        assignees: {
          include: {
            userAccount: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    const requestToUpdateStatusOf = await prisma.technicalRequest.findUnique({
      where: {
        technicalRequestId: requestId,
      },
      include: {
        assignees: true,
      },
    });

    await prisma.technicalRequest.update({
      where: {
        technicalRequestId: requestId,
      },
      data: {
        requestStatusId: 8,
      },
    });

    return res.status(200).send({ message: "assigned!", data: allRequests });
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
export const unassignUserFromTechnicalRequest = async (
  req: Request<{ requestId: string; assignedToId: string }>,
  res: Response
) => {
  try {
    const { requestId, unassignedUserId } = req.body;

    if (!unassignedUserId) {
      return res.status(404).send("testing...");
    }

    const technicalRequestsUsers = await prisma.technicalRequestUser.delete({
      where: {
        userAccountId_technicalRequestId: {
          technicalRequestId: requestId,
          userAccountId: unassignedUserId,
        },
      },
    });

    const technicalRequestToUpdateStatusOf =
      await prisma.technicalRequest.findUnique({
        where: {
          technicalRequestId: requestId,
        },
        include: {
          assignees: true,
        },
      });

    if (
      technicalRequestToUpdateStatusOf &&
      technicalRequestToUpdateStatusOf.assignees.length <= 0
    ) {
      await prisma.technicalRequest.update({
        where: {
          technicalRequestId: requestId,
          assignees: {},
        },
        data: {
          requestStatusId: 1,
        },
      });
    }

    console.log("technicalRequestsUsers: ", technicalRequestsUsers);
    return res.status(200).send("unassigned!");
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
