import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "username must be at least 3 characters long")
    .max(20, "username too long"),
  email: z.email("invalid email address"),
  password: z.string().min(6, "password too short"),
});

export const loginSchema = z.object({
  email: z.email("invalid email address"),
  password: z.string().min(6, "pasword must be atleast 6 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
