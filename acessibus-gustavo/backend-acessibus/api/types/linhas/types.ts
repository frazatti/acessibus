import type z from "zod";
import type { Prisma } from "../../../generated/prisma/browser";
import type { CreateLinhaSchema, SearchLinhaSchema } from "../../schemas/LinhaSchema";

export type LinhaWithUsuarios = Prisma.linhasGetPayload<{
    include: {
        usuarios_linhas: true
    }
}>

export type Linha = Prisma.linhasGetPayload<{
    include: never
}>

export type CreateLinhaInput = z.infer<typeof CreateLinhaSchema>
export type SearchLinhaInput = z.infer<typeof SearchLinhaSchema>