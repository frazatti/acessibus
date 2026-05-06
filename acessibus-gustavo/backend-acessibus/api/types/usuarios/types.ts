import type z from "zod";
import type { Prisma } from "../../../generated/prisma/browser";
import type { CreateUsuarioSchema } from "../../schemas/usuarioSchema";

export type UsuarioWithLinhas = Prisma.usuariosGetPayload<{
    include: {
        usuarios_linhas: true
    }
}>

export type Usuario = Prisma.usuariosGetPayload<{
    include: never
}>

export type CreateUsuarioInput = z.infer<typeof CreateUsuarioSchema>