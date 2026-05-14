import type z from "zod";
import type { Prisma } from "../../../generated/prisma/browser";
import type { CreateUsuarioSchema, UpdateUsuarioSchema, UsuarioOutputSchema } from "../../schemas/UsuarioSchema";

export type UsuarioWithLinhas = Prisma.usuariosGetPayload<{
    include: {
        usuarios_linhas: true
    }
}>

export type Usuario = Prisma.usuariosGetPayload<{
    include: never
}>

export type CreateUsuarioInput = z.infer<typeof CreateUsuarioSchema>
export type UpdateUsuarioInput = z.infer<typeof UpdateUsuarioSchema>
export type UsuarioOutput = z.infer<typeof UsuarioOutputSchema>