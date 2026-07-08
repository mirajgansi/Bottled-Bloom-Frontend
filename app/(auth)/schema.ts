import z from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Minimum 8 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z.string().min(2, { message: "Enter your name" }),
    email: z.email({ message: "Enter a valid email" }),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string().min(10, { message: "Minimum 10 characters" }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterData = z.infer<typeof registerSchema>;
