import { ZodType, z } from "zod";

export class AuthValidation {

    static readonly SESSION : ZodType = z.string().uuid()

}