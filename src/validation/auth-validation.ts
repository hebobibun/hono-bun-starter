import { ZodType, z } from "zod";

export class AuthValidation {

    static readonly SESSION : ZodType = z.string().uuid()
    static readonly REQUEST_EMAIL_VERIFICATION : ZodType = z.object({
        email: z.string().email(),
    })
    static readonly VERIFY_EMAIL : ZodType = z.object({
        token: z.string().uuid(),
        email: z.string().email(),
    })

}