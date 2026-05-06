import z from "zod";

export const CreateUsuarioSchema = z.object({
    nome: z.string().min(2).max(100),
    email: z.email().min(2).max(250),
    senha: z.string().min(6).max(255),
    foto: z.string().optional()
})