import z from "zod";

export const AssignUsuarioToLinhaSchema = z.object({
    id_linha: z.string().uuid().min(2).max(100),
    id_usuario: z.string().uuid().min(2).max(100),
    ultimo_acesso: z.coerce.date(),
    favorito: z.boolean(),
})