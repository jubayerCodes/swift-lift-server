import z from "zod";

export const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .min(2, { error: "Name must be at least 2 characters long" })
    .max(50, { error: "Name cannot exceed 50 characters" }),
  email: z.email({ error: "Invalid email address format" }),
  password: z
    .string({ error: "Password must be string" })
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[A-Z])/, {
      error: "Password must contain at least 1 uppercase letter",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      error: "Password must contain at least 1 special character",
    })
    .regex(/^(?=.*\d)/, {
      error: "Password must contain at least 1 number.",
    }),
  phone: z
    .string({ error: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      error:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  picture: z.string({ error: "Picture Number must be string" }).optional(),
  address: z
    .string({ error: "Address must be string" })
    .max(200, { error: "Address cannot exceed 200 characters." })
    .optional(),
});
