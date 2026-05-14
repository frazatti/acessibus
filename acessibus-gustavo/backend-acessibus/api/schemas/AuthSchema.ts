import z, { email } from "zod";

export const LoginSchema = z.object({
    email: z.string().email().min(2).max(255),
    senha: z.string().min(6).max(255)
});

export const LoginResponseSchema = z.object({
    id: z.string(),
    nome: z.string().min(2).max(255),
    email: z.string().email().min(2).max(255),
    foto: z.string().nullable().optional(),
    token: z.string(),
})