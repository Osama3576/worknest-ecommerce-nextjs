import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().optional(),
  line1: z.string().min(3, "Street address is required."),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  postalCode: z.string().min(3, "Postal code is required."),
  country: z.string().min(2, "Country is required."),
  note: z.string().max(300).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email."),
});

export const addressSchema = checkoutSchema.extend({
  label: z.string().min(2, "Label is required."),
  setDefault: z.boolean().optional(),
});
