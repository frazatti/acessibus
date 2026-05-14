import type z from "zod";
import type { LoginResponseSchema, LoginSchema } from "../../schemas/AuthSchema";

export type LoginInput = z.infer<typeof LoginSchema>;
export type LoginOutput = z.infer<typeof LoginResponseSchema>;