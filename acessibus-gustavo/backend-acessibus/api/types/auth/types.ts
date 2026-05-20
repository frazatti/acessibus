import type z from "zod";
import type { LoginResponseSchema, LoginSchema } from "../../schemas/AuthSchema";
import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export type LoginInput = z.infer<typeof LoginSchema>;
export type LoginOutput = z.infer<typeof LoginResponseSchema>;

export interface AuthRequest extends Request {
    userId?: string | null;
}

export interface TokenPayload extends JwtPayload {
    id: string;
}