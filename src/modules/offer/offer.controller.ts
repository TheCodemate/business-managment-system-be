import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { PrismaClient } from "@prisma/client";

export const addOffer = async (
  req: Request<{}, { userId: string; offerTitle: string }>,
  res: Response
) => {
  try {
    const { userId, offerTitle } = req.body;

    await prisma.offers.create({
      data: {
        createdById: userId,
        offerTitle: offerTitle,
        offerNote: "",
      },
    });

    return res.status(201).send({ message: "New offer added successfully!" });
  } catch (error) {
    //@ts-ignore
    console.log("error: ", error?.message);

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

export const getOffers = (db: PrismaClient) => {
  return db.offers.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const offer = (db: PrismaClient) => {
  return {
    get: () => getOffers(db),
  };
};

class OfferRepository {
  #db;

  constructor(db: PrismaClient) {
    this.#db = db;
  }

  get() {
    return this.#db.offers.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

const offerRepo = new OfferRepository(prisma);
// const offerRepo = offer(prisma)

export const getOffersHandler = async (req: Request, res: Response) => {
  try {
    const offers = await offerRepo.get();

    return res.status(200).send(offers);
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
export const getOfferById = async (req: Request, res: Response) => {
  try {
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

export const updateOfferById = async (req: Request, res: Response) => {
  try {
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
export const removeOfferById = async (
  req: Request<{}, { userId: string; offerId: string }>,
  res: Response
) => {
  try {
    const { userId, offerId } = req.body;

    await prisma.offers.delete({
      where: {
        createdById: userId,
        offerId: offerId,
      },
    });

    return res.status(201).send({ message: "Offer was deleted successfully!" });
  } catch (error) {
    //@ts-ignore
    console.log("error: ", error?.message);

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

export const addProductToOffer = async (
  req: Request<{}, { userId: string }>,
  res: Response
) => {
  try {
    const { offerId, productId } = req.body;

    await prisma.offerItem.create({
      data: {
        productId: productId,
        offerId: offerId,
      },
    });

    return res.status(201).send({ message: "New offer added successfully!" });
  } catch (error) {
    //@ts-ignore
    console.log("error: ", error?.message);

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
// };

export const getOfferProducts = async (
  req: Request<{}, { offerId: string }>,
  res: Response
) => {
  try {
    const { offerId } = req.query;

    const offer = await prisma.offers.findUnique({
      where: {
        offerId: offerId?.toString(),
      },
      include: {
        offerItems: {
          select: {
            product: true,
            offerItemId: true,
          },
        },
      },
    });

    return res.status(201).send(offer?.offerItems);
  } catch (error) {
    //@ts-ignore
    console.log("error: ", error?.message);

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

export const deleteOfferProductById = async (
  req: Request<{}, { userId: string; offerId: string; offerItemId: string }>,
  res: Response
) => {
  try {
    const { userId, offerId, offerItemId } = req.body;

    await prisma.offerItem.delete({
      where: {
        offerId: offerId,
        offerItemId: offerItemId,
      },
    });

    return res.status(201).send({ message: "Item was deleted successfully!" });
  } catch (error) {
    //@ts-ignore
    console.log("error: ", error.message);
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

export const updateOfferNote = async (req: Request, res: Response) => {
  try {
    const { offerId, userId, offerNote } = req.body;

    await prisma.offers.update({
      where: {
        offerId: offerId,
      },
      data: {
        offerNote: offerNote,
      },
    });

    return res.status(201).send({ message: "Item was deleted successfully!" });
  } catch (error) {
    //@ts-ignore
    console.log("error: ", error.message);
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

export const getOfferNoteById = async (req: Request, res: Response) => {
  try {
    const { offerId, userId } = req.query;

    console.log(">>>>>>offerId: ");

    if (!offerId || typeof offerId !== "string") {
      console.log("error: ", offerId);
      return res.status(404).send("could not fetch note");
    }

    const data = await prisma.offers.findUnique({
      where: {
        offerId: offerId,
      },
      select: {
        offerNote: true,
      },
    });

    console.log("Yeah!");
    console.log(data?.offerNote);

    return res.status(201).send(data?.offerNote);
  } catch (error) {
    //@ts-ignore
    console.log("BE - getOfferNoteById - ERROR: ", error.message);
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
