import z from "zod";

export const AssignUsuarioToLinhaSchema = z.object({
    id_usuario: z.string().uuid().min(2).max(100),
    ultimo_acesso: z.iso.datetime(),
    favorito: z.boolean(),
})