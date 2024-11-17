import { z, ZodType } from "zod";

export class UserValidation {

    static readonly REGISTER : ZodType = z.object({
        fullname: z.string().min(1).max(100),
        password: z.string().min(1).max(100),
        email: z.string().email(),
    })

    static readonly LOGIN : ZodType = z.object({
        email: z.string().email(),
        password: z.string().min(1).max(100),
    })

}