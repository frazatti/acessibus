import type z from "zod";
import type { usuarios_linhasGetPayload } from "../../../generated/prisma/models";
import type { AssignUsuarioToLinhaSchema } from "../../schemas/UsuariosLinhasSchema";

export type UsuariosWithLinhas = usuarios_linhasGetPayload<{
    include: {
        usuarios: true,
        linhas: true
    }
}>

export type UsuarioAssigned = usuarios_linhasGetPayload<{
    include: { usuarios: true, linhas: never }
}>

export type LinhaAssigned = usuarios_linhasGetPayload<{
    include: { usuarios: never, linhas: true }
}>

export type AssignUsuarioToLinhaInput = z.infer<typeof AssignUsuarioToLinhaSchema>

export type InteracaoOutput = {
    id: string;
    codigo: string;
    nome_linha: string;
    itinerario: string;
    sentido: string;
    favorito: boolean;
    ultimoAcesso?: Date;
}