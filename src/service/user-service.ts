import { HTTPException } from "hono/http-exception";
import { db } from "../application/db";
import { LoginUserRequest, RegisterUserRequest, toUserResponse, UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { count, eq } from "drizzle-orm";
import { sessionsTable, usersTable } from "../application/db/schema";
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

    static async loginUser(request: LoginUserRequest): Promise<UserResponse> {
        try {
            // Validate request using Zod schema
            const validatedRequest = UserValidation.LOGIN.parse(request);

            // Check if user exists
            const user = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.email, validatedRequest.email));

            if (user.length === 0 || !user[0].emailVerified) {
                throw new HTTPException(400, {
                    message: "Email or password is invalid"
                });
            }

            // Check if password is correct
            const isPasswordCorrect = await Bun.password.verify(validatedRequest.password, user[0].password);

            if (!isPasswordCorrect) {
                throw new HTTPException(401, {
                    message: "Email or password is invalid"
                });
            }

            // Generate session ID
            const sessionID = crypto.randomUUID();

            // Store session in database
            await db
                .insert(sessionsTable)
                .values({
                    sessionID,
                    userID: user[0].userID,
                    expiry: new Date(Date.now() + 12 * 3600 * 1000),
                })
                .returning();

            // Return response
            return toUserResponse(user[0], sessionID);

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
            console.error('Error in loginUser:', error);
            throw new HTTPException(500, {
                message: "Internal server error"
            });
        }
    }
}