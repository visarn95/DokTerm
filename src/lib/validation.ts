import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Fjalëkalimi duhet të ketë së paku 8 karaktere.")
  .max(128, "Fjalëkalimi është shumë i gjatë.");

export const registrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Shkruaj emrin dhe mbiemrin.")
      .max(80, "Emri është shumë i gjatë."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Shkruaj një email të vlefshëm.")
      .max(254, "Email-i është shumë i gjatë."),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Fjalëkalimet nuk përputhen.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Shkruaj një email të vlefshëm."),
  password: z.string().min(1, "Shkruaj fjalëkalimin."),
});
