import { ZodString, ZodTypeAny, ZodUnion, z } from "zod";

export const memberSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
  iat: z.number(),
});

export type MemberType = z.infer<typeof memberSchema>;

export type IconTypes = "add" | "null";

const doesStringContainNumbersOnly = (
  stringToCheck: ZodString | ZodUnion<[ZodTypeAny, ...ZodTypeAny[]]>
) => stringToCheck.refine((value) => /^[0-9]+$/.test(value));

const addressSchema = z.object({
  street: z
    .string()
    .min(2, { message: "Street name must be 2 chars long at least." }),
  street_number: z
    .string()
    .max(5, { message: "Street number cannot be longer than 5 digits" }),
  apartment_number: z
    .string()
    .max(5, { message: "Apartment number cannot be longer than 5 digits" })
    .or(z.literal("")),
  city: z.string(),
  postal_code: z.string().min(3).max(7),
  post: z.string(),
  country: z.string(),
});

const contactPersonSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" }),
  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" }),
  phone_number: z
    .string()
    .min(7, { message: "Phone number must contain at least 7 digits" })
    .max(12, {
      message: "Phone number must not contain more than 10 digits",
    }),
  email: z.string().email({ message: "Incorrect email" }),
});

const paymentTypeSchema = z.enum(["cash", "bankTransfer"]);

export const customerSchema = z.object({
  company_name: z
    .string()
    .min(1, { message: "Name must be at least 2 characters long" })
    .max(255, { message: "Name cannot be longer than 255 characters" }),
  short_name: z.string().max(255),

  vat_no: z
    .string()
    .min(7, { message: "Vat number must be at least 7 characters long" })
    .max(10, { message: "Vat number cannot be longer than 10 characters" }),
  is_company: z.boolean(),
  address: addressSchema,
  payment_term: z.string(),
  payment_type: paymentTypeSchema,
  contact_person: contactPersonSchema,
  note: z.string().max(2000).optional(),
});

export const cartItemSchema = z.object({
  product_id: z.string(),
  quantity: z.number(),
});

export type CartItemType = z.infer<typeof cartItemSchema>;
export type CustomerType = z.infer<typeof customerSchema>;
