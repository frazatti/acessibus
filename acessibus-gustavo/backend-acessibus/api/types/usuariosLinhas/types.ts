import type z from "zod";
import type { usuarios_linhasGetPayload } from "../../../generated/prisma/models";
import type { AssignUsuarioToLinhaSchema } from "../../schemas/usuariosLinhasSchema";

export type UsuariosWithLinhas = usuarios_linhasGetPayload<{
    include: {
        usuarios: true,
        linhas: true
    }
}>

export type UsuarioAssigned = usuarios_linhasGetPayload<{
    include: never
}>

export type AssignUsuarioToLinhaInput = z.infer<typeof AssignUsuarioToLinhaSchema>