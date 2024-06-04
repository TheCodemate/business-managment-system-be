import { Prisma, PrismaClient } from "@prisma/client";
import { getExpirationTimePeriod } from "./utils/getExpiratoinTimePeriod";

type RequestTypes =
  | "price"
  | "purchasePrice"
  | "availability"
  | "technicalDocumentation";

type Units = "m2" | "szt" | "komplet" | "mb";

class RequestDTO {
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
    return newRequest;
  }
}

class TechnicalRequest {
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

  static fromRequest(request: RequestDTO) {
    const data = new TechnicalRequest();

    data.requestTypes = request.requestTypes;
    data.productCategory = request.productCategory;
    data.additionalInfo = request.additionalInfo;
    data.contactPerson = request.contactPerson;
    data.contactPersonPhone = request.contactPersonPhone;
    data.contactPersonEmail = request.contactPersonEmail;
    data.collectionName = request.collectionName;
    data.productCode = request.productCode;
    data.format = request.format;
    data.producer = request.producer;
    data.color = request.color;
    data.finish = request.finish;
    data.quantity = request.quantity;
    data.unit = request.unit;

    return data;
  }
}

function toPrismaCreate(
  data: TechnicalRequest
): Prisma.TechnicalRequestCreateInput {
  return {};
}

const save = async (connection: PrismaClient, data: TechnicalRequest) => {
  const prismaDTO: Prisma.TechnicalRequestCreateInput = {
    productCategory: data.productCategory,
    additionalInfo: data.additionalInfo,
    contactPerson: data.contactPerson,
    contactPersonPhone: data.contactPersonPhone,
    contactPersonEmail: data.contactPersonEmail,
    collectionName: data.collectionName,
    productCode: data.productCode,
    format: data.format,
    producer: data.producer,
    color: data.color,
    quantity: data.quantity,
    finish: data.finish,
    unit: data.unit,
    userAccountId: req.member.user_id,
    requestStatusId: 1,
    expiresAt: new Date(
      new Date().getTime() + getExpirationTimePeriod(data.requestTypes)
    ),
  };
  //PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>.technicalRequest: Prisma.TechnicalRequestDelegate<DefaultArgs>
  await connection.technicalRequest.create({
    data: prismaDTO,
  });
};

// const prismaDTO: Prisma.TechnicalRequestCreateInput = {
//   productCategory: data.productCategory,
//   additionalInfo: data.additionalInfo,
//   contactPerson: data.contactPerson,
//   contactPersonPhone: data.contactPersonPhone,
//   contactPersonEmail: data.contactPersonEmail,
//   collectionName: data.collectionName,
//   productCode: data.productCode,
//   format: data.format,
//   producer: data.producer,
//   color: data.color,
//   quantity: data.quantity,
//   finish: data.finish,
//   unit: data.unit,
//   userAccountId: req.member.user_id,
//   requestStatusId: 1,
//   expiresAt: new Date(
//     new Date().getTime() +
//       getExpirationTimePeriod(transformedBody.requestTypes)
//   ),
//   requestTypes: {
//     create: transformedBody.requestTypes.map((typeName) => ({
//       technicalRequestType: {
//         connect: {
//           typeId: availableRequestTypes.find(
//             (requestType) => requestType.typeName === typeName
//           )?.typeId,
//         },
//       },
//     })),
//   },
//   technicalRequestFiles: {
//     createMany: {
//       data: transformedBody.uploadedFiles.map((uploadedFile) => ({
//         fileUrl: uploadedFile.fileUrl,
//         gcsId: uploadedFile.fileId,
//       })),
//     },
//   },
// };
