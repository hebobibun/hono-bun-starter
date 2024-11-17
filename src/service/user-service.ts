import { HTTPException } from "hono/http-exception";
import { db } from "../application/db";
import { RegisterUserRequest, toUserResponse, UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { count, eq } from "drizzle-orm";
import { usersTable } from "../application/db/schema";
import { ZodError } from "zod";

export class UserService {
    static async registerUser(request: RegisterUserRequest): Promise<UserResponse> {
        try {
            // Validate request using Zod schema
            const validatedRequest = UserValidation.REGISTER.parse(request);

            // Check if user already exists
            const userWithRequestEmail = await db
                .select({ count: count() })
                .from(usersTable)
                .where(eq(usersTable.email, validatedRequest.email));

            if (userWithRequestEmail[0].count > 0) {
                throw new HTTPException(400, {
                    message: "Email already exists"
                });
            }

            // Generate UUID once and reuse it
            const userID = crypto.randomUUID();

            // Hash password
            const hashedPassword = await Bun.password.hash(validatedRequest.password, {
                algorithm: "bcrypt",
                cost: 10,
            });

            // Store user in database
            const user = await db
                .insert(usersTable)
                .values({
                    userID,
                    fullname: validatedRequest.fullname,
                    email: validatedRequest.email,
                    password: hashedPassword,
                })
                .returning();

            // Return response
            return toUserResponse(user[0]);

        } catch (error) {
            // Handle Zod validation errors
            if (error instanceof ZodError) {
                throw new HTTPException(400, {
                    message: "Validation failed",
                });
            }

            // Re-throw HTTPException if it's already one
            if (error instanceof HTTPException) {
                throw error;
            }

            // Handle unexpected errors
            console.error('Error in registerUser:', error);
            throw new HTTPException(500, {
                message: "Internal server error"
            });
        }
    }
}