import path from "node:path";
import { Request, Response } from "express";
import { Storage } from "@google-cloud/storage";
import multer from "multer";
import { getExpirationTimePeriod } from "../../utils/getExpiratoinTimePeriod";
import process from "node:process";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../../prisma";
import { TechnicalRequestRequestType } from "src/types";

const googleStorage = new Storage({
  keyFilename: path.join(
    process.cwd(),
    "business-project-managment-9d84f37de2e3.json"
  ),
  projectId: "business-project-managment",
});
const upload = multer({ dest: "uploads/" });

type RequestTypes =
  | "price"
  | "purchasePrice"
  | "availability"
  | "technicalDocumentation";

type Units = "m2" | "szt" | "komplet" | "mb";

export class RequestDTO {
  requestTypes: RequestTypes[] = ["price"];
  productCategory: string = "";
  additionalInfo: string | undefined;
  contactPerson: string = "";
  contactPersonPhone: string = "";
  contactPersonEmail: string = "";
  collectionName: string = "";
  productCode: string = "";
  format: string = "";
  producer: string = "";
  color: string = "";
  quantity: string = "";
  finish: string = "";
  unit: Units = "szt";
  uploadedFiles: { fileUrl: string; fileId: string }[] = [];
  memberId: string = "";

  static fromBody(body: Record<string, any>) {
    const newRequest = new RequestDTO();

    newRequest.requestTypes = body.requestTypes;
    newRequest.productCategory = body.productCategory;
    newRequest.additionalInfo = body.additionalInfo;
    newRequest.contactPerson = body.contactPerson;
    newRequest.contactPersonPhone = body.contactPersonPhone;
    newRequest.contactPersonEmail = body.contactPersonEmail;
    newRequest.collectionName = body.collectionName;
    newRequest.productCode = body.productCode;
    newRequest.format = body.format;
    newRequest.producer = body.producer;
    newRequest.color = body.color;
    newRequest.finish = body.finish;
    newRequest.quantity = body.quantity;
    newRequest.unit = body.unit;
    newRequest.uploadedFiles = body.uploadedFiles;
    newRequest.memberId = body.memberId;
    return newRequest;
  }
}

const requestFilesBucket = googleStorage.bucket("bms-request_files_bucket");

export const postTechnicalRequests = async (body: RequestDTO) => {
  const availableRequestTypes = await prisma.technicalRequestType.findMany({
    where: {
      typeName: { in: body.requestTypes },
    },
  });

  await prisma.technicalRequest.create({
    data: {
      productCategory: body.productCategory,
      additionalInfo: body.additionalInfo,
      contactPerson: body.contactPerson,
      contactPersonPhone: body.contactPersonPhone,
      contactPersonEmail: body.contactPersonEmail,
      collectionName: body.collectionName,
      productCode: body.productCode,
      format: body.format,
      producer: body.producer,
      color: body.color,
      quantity: body.quantity,
      finish: body.finish,
      unit: body.unit,
      userAccountId: body.memberId,
      requestStatusId: 1,
      expiresAt: new Date(
        new Date().getTime() + getExpirationTimePeriod(body.requestTypes)
      ),
      requestTypes: {
        create: availableRequestTypes.map((requestType) => ({
          technicalRequestType: {
            connect: {
              typeId: requestType.typeId,
            },
          },
        })),
      },
      technicalRequestFiles: {
        create: body.uploadedFiles.map((uploadedFile) => ({
          fileUrl: uploadedFile.fileUrl,
          gcsId: uploadedFile.fileId,
        })),
      },
    },
  });
};

export const getUploadedFiles = async (req: Request, res: Response) => {
  try {
    const files = await prisma.technicalRequestFiles.findMany({
      where: {
        technicalRequestId: req.body.technicalRequestId,
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

export const uploadRequestFile = async (req: Request, res: Response) => {
  try {
    if (!req.file)
      return res.status(422).send({
        message: "No photos have been uploaded. Choose files and try again.",
      });

    //zvalidować zawartość pliku -> fileType libka do validacji plików
    const uploadedPicture = await requestFilesBucket.upload(req.file.path, {
      metadata: {
        contentType: "application/plain",
      },
    });

    //@ts-ignore
    const fileUrl = uploadedPicture[1].mediaLink;
    //@ts-ignore
    const fileName = uploadedPicture[1].name;

    return res.status(200).send({ fileId: fileName, fileUrl });
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

export const removeFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.query;
    if (!fileId)
      return res.status(422).send({
        message: "No photos have been uploaded. Choose files and try again.",
      });

    //@ts-ignore
    const deletedPicture = await requestFilesBucket.file(fileId).delete();

    return res.status(200).send({ message: "File removed" });
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

export const getTechnicalRequests = async (_: Request, res: Response) => {
  try {
    const requests = await prisma.technicalRequest.findMany({
      include: {
        technicalRequestResolvedBy: {
          select: {
            userAccount: {
              select: {
                firstName: true,
                lastName: true,
                userId: true,
              },
            },
          },
        },
        userAccount: {
          select: {
            email: true,
            userId: true,
            firstName: true,
            lastName: true,
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
                firstName: true,
                lastName: true,
                email: true,
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
        technicalRequestResponse: {
          select: {
            availability: true,
            price: true,
            productionDate: true,
            purchasePrice: true,
            substitute: true,
            technicalDocumentation: true,
            technicalResponseText: true,
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
        technicalRequestFiles: {
          select: {
            fileUrl: true,
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

    if (!requestToUpdateStatusOf?.resolved) {
      await prisma.technicalRequest.update({
        where: {
          technicalRequestId: requestId,
        },
        data: {
          requestStatusId: 8,
        },
      });
    }

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
  req: Request<{ userId: string; requestId: string }>,
  res: Response
) => {
  try {
    const { requestId, userId } = req.body;

    if (!userId) {
      return res.status(404).send("testing...");
    }

    const technicalRequestsUsers = await prisma.technicalRequestUser.delete({
      where: {
        userAccountId_technicalRequestId: {
          technicalRequestId: requestId,
          userAccountId: userId,
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
      technicalRequestToUpdateStatusOf.assignees.length <= 0 &&
      !technicalRequestToUpdateStatusOf.resolved
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

export const postResponse = async (
  req: Request<{
    technicalRequestId: string;
    technicalResponseText: string;
    availability: string;
    technicalDocumentation: string;
    purchasePrice: string;
    price: string;
    substitute: string;
    productionDate: string;
  }>,
  res: Response
) => {
  const { user_id } = req.member;

  try {
    await prisma.technicalRequestResponse.create({
      data: {
        userAccountId: user_id,
        ...req.body,
      },
    });

    const updatedTechnicalRequest = await prisma.technicalRequest.update({
      where: {
        technicalRequestId: req.body.technicalRequestId,
      },
      data: {
        requestStatusId: 5,
        resolvedAt: new Date(),
        resolved: true,
      },
    });

    const resolvedBy = await prisma.technicalRequestResolvedBy.create({
      data: {
        userAccountId: user_id,
        technicalRequestId: req.body.technicalRequestId,
      },
    });

    console.log("postResponse - resolvedBy: ", resolvedBy);

    return res.status(200).send("Responded to request!");
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

export const getTechnicalRequestResponseById = async (
  req: Request<{ technicalRequestId: string }>,
  res: Response
) => {
  try {
    console.log("req.body: ", req.body);
    const { technicalRequestId } = req.body;
    const technicalResponse = await prisma.technicalRequest.findUnique({
      where: {
        technicalRequestId: technicalRequestId,
      },
      include: {
        technicalRequestResponse: {
          select: {
            availability: true,
            price: true,
            productionDate: true,
            purchasePrice: true,
            substitute: true,
            technicalDocumentation: true,
            technicalResponseText: true,
          },
        },
      },
    });

    console.log("technicalResponse: ", technicalResponse);

    return res.status(200).send(technicalResponse);
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
