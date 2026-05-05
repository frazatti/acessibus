import z from "zod";

export const CreateLinhaSchema = z.object({
    codigo: z.string().min(2).max(100),
    nome_linha: z.string().min(2).max(60),
    itinerario: z.string().min(2),
    sentido: z.string().min(2).max(20)
})