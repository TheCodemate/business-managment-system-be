type RequestType = (
  | "price"
  | "purchasePrice"
  | "availability"
  | "productionDate"
  | "substitute"
  | "technicalDocumentation"
)[];

export const getExpirationTimePeriod = (requestTypes: RequestType) => {
  if (
    requestTypes.includes("productionDate") ||
    requestTypes.includes("technicalDocumentation") ||
    requestTypes.includes("availability")
  ) {
    return 24 * 60 * 60 * 1000;
  }

  return 2 * 60 * 60 * 1000;
};
