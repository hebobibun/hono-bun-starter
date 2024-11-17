import { ZodType, z } from "zod";


export class ContactValidation {

    static readonly CREATE : ZodType = z.object({
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100).optional(),
        email: z.string().email().optional(),
        phone: z.string().min(1).max(100).optional(),
    })

    static readonly UPDATE : ZodType = z.object({
        contactID: z.number().min(1).max(100),
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().min(1).max(100).optional(),
        email: z.string().email().optional(),
        phone: z.string().min(1).max(100).optional(),
    })

    static readonly SEARCH : ZodType = z.object({
        name: z.string().min(1).max(100).optional(),
        email: z.string().min(1).max(100).optional(),
        phone: z.string().min(1).max(100).optional(),
        page: z.number().min(1).max(100).positive(),
        size: z.number().min(1).max(100).positive(),
    })

    static readonly EXISTING : ZodType = z.object({
        contactID: z.number().min(1).max(100),
    })
}