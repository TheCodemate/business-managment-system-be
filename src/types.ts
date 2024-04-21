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
  streetNumber: z
    .string()
    .max(5, { message: "Street number cannot be longer than 5 digits" }),
  apartmentNumber: z
    .string()
    .max(5, { message: "Apartment number cannot be longer than 5 digits" })
    .or(z.literal("")),
  city: z.string(),
  postalCode: z.string().min(3).max(7),
  post: z.string(),
  country: z.string(),
});

const contactPersonSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" }),
  phoneNumber: z
    .string()
    .min(7, { message: "Phone number must contain at least 7 digits" })
    .max(12, {
      message: "Phone number must not contain more than 10 digits",
    }),
  email: z.string().email({ message: "Incorrect email" }),
});

const paymentTypeSchema = z.enum(["cash", "bankTransfer"]);

export const customerSchema = z.object({
  companyName: z
    .string()
    .min(1, { message: "Name must be at least 2 characters long" })
    .max(255, { message: "Name cannot be longer than 255 characters" }),
  shortName: z.string().max(255),

  vatNo: z
    .string()
    .min(7, { message: "Vat number must be at least 7 characters long" })
    .max(10, { message: "Vat number cannot be longer than 10 characters" }),
  isCompany: z.boolean(),
  address: addressSchema,
  paymentTerm: z.string(),
  paymentType: paymentTypeSchema,
  contactPeron: contactPersonSchema,
  note: z.string().max(2000).optional(),
});

export const cartItemSchema = z.object({
  product_id: z.string(),
  quantity: z.number(),
});

const orderNoteRequestSchema = z.object({
  order_note_id: z.string(),
  note: z.string().max(500),
});

const shippingAddressRequestSchema = z.object({
  company: z.string(),
  address: z.string(),
  apartment_number: z.string(),
  country: z.string(),
  city: z.string(),
  postal_code: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  email: z.string(),
  note: z.string(),
});

const orderItemRequestSchema = z.object({
  order_item_id: z.string(),
  product_id: z.string(),
  order_id: z.string(),
  quantity: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});

const orderRequestSchema = z.object({
  userAccountId: z.string(),
  shipping_address_id: z.string(),
  order_note_id: z.string(),
  order_item_id: z.string(),
  shipping_address: shippingAddressRequestSchema,
  order_note: orderNoteRequestSchema.optional(),
  order_items: z.array(orderItemRequestSchema),
  created_at: z.date(),
  updated_at: z.date(),
});

//sprawdzic czy string nie zawiera sql/html
export const technicalRequestRequestSchema = z.object({
  requestTypes: z.array(
    z.enum([
      "price",
      "priceNet",
      "availability",
      "productionDate",
      "substitute",
      "technicalDocumentation",
    ])
  ),
  productCode: z
    .string()
    .min(1, { message: "Kod produktu jest wymagane" })
    .max(50),
  collectionName: z
    .string()
    .min(1, { message: "Nazwa produktu jest wymagana" })
    .max(50),
  width: z.number(),
  height: z.number(),
  thickness: z.number(),
  finish: z.string(),
  producer: z.string().min(1, { message: "Producent jest wymagany" }).max(50),
  color: z.string().min(1, { message: "Kolor jest wymagany" }).max(50),
  productCategory: z.enum([
    "ceramicTiles",
    "bathroomEquipment",
    "accessories",
    "furniture",
    "lightning",
  ]),
  quantity: z.string(),
  additionalInfo: z.string(),
  contactPerson: z.string().optional(),
  contactPersonEmail: z
    .string()
    .min(1, { message: "Producent jest wymagany" })
    .max(50)
    .optional(),
  contactPersonPhone: z
    .string()
    .min(1, { message: "Producent jest wymagany" })
    .max(50)
    .optional(),
  files: z.string().optional(),
  // highPriority: z.boolean(),
  // status: z.enum(["notAssigned", "inProgress", "expired", "resolved"]),
  // assignedTo: z.array(
  //   z.object({
  //     firstName: z.string(),
  //     lastName: z.string(),
  //     store: z.string(),
  //     department: z.string(),
  //   })
  // ),
  // requestedBy: z.object({
  //   firstName: z.string(),
  //   lastName: z.string(),
  //   store: z.string(),
  //   department: z.enum(["sales", "technicalSupport"]),
  // }),
});

export const technicalRequestTypeSchema = z.array(
  z.object({
    technicalRequestType: z.object({
      typeId: z.number(),
      typeName: z.enum([
        "price",
        "priceNet",
        "availability",
        "productionDate",
        "substitute",
        "technicalDocumentation",
      ]),
    }),
  })
);

export const technicalRequestResponseSchema = z.object({
  technicalRequestId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
  requestTypes: technicalRequestTypeSchema,
  productCode: z
    .string()
    .min(1, { message: "Kod produktu jest wymagane" })
    .max(50),
  collectionName: z
    .string()
    .min(1, { message: "Nazwa produktu jest wymagana" })
    .max(50),
  width: z.string(),
  height: z.string(),
  thickness: z.string(),
  finish: z.string(),
  producer: z.string().min(1, { message: "Producent jest wymagany" }).max(50),
  color: z.string().min(1, { message: "Kolor jest wymagany" }).max(50),
  productCategory: z.enum([
    "ceramicTiles",
    "bathroomEquipment",
    "accessories",
    "furniture",
    "lightning",
  ]),
  quantity: z.string(),
  additionalInfo: z.string(),
  contactPerson: z.string(),
  contactPersonEmail: z
    .string()
    .min(1, { message: "Producent jest wymagany" })
    .max(50),
  contactPersonPhone: z
    .string()
    .min(1, { message: "Producent jest wymagany" })
    .max(50),
  files: z.string().optional(),
  requestStatus: z.object({
    technicalRequestStatusName: z.enum([
      "notAssigned",
      "inProgress",
      "expired",
      "resolved",
      "canceled",
      "forwarded",
      "assigned",
    ]),
  }),
  assignees: z.array(
    z.object({
      userAccount: z.object({
        userId: z.string(),
      }),
    })
  ),
});

// Generate types
export type ShippingAddressRequestType = z.infer<
  typeof shippingAddressRequestSchema
>;
export type OrderNoteRequestType = z.infer<typeof orderNoteRequestSchema>;
export type OrderItemRequestType = z.infer<typeof orderItemRequestSchema>;
export type OrderRequestType = z.infer<typeof orderRequestSchema>;

export type CartItemType = z.infer<typeof cartItemSchema>;
export type CustomerType = z.infer<typeof customerSchema>;
export type TechnicalRequestRequestType = z.infer<
  typeof technicalRequestRequestSchema
>;

export type TechnicalRequestResponseSchema = z.infer<
  typeof technicalRequestResponseSchema
>;
