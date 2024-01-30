export const bigIntToStringReplacer = (_: any, value: unknown) =>
  typeof value === "bigint" ? value.toString() : value;
