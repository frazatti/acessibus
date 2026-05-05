import type z from "zod";
import type { Prisma } from "../../../generated/prisma/browser";
import type { CreateLinhaSchema } from "../../schemas/linhaSchema";

export type LinhasWithUsuarios = Prisma.linhasGetPayload<{
    include: {
        usuarios_linhas: true
    }
}>

export type Linhas = Prisma.linhasGetPayload<{
    include: never
}>

export type CreateLinhaInput = z.infer<typeof CreateLinhaSchema>