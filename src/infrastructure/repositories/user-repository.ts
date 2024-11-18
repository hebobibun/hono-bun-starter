import { HTTPException } from "hono/http-exception";
import { db } from "../database";
import { LoginUserRequest, RegisterUserRequest, toUserResponse, UserResponse } from "../../domain/model/user-model";
import { UserValidation } from "../../application/validation/user-validation";
import { count, eq } from "drizzle-orm";
import { emailVerificationsTable, sessionsTable, usersTable } from "../database/schema";
import { ZodError } from "zod";
import { sendMail } from "../external/mail-sender";

export class UserRepository {
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

            // generate token for email verification
            const token = crypto.randomUUID();

            // store email verication
            await db
                .insert(emailVerificationsTable)
                .values({
                    userID: user[0].userID,
                    email: validatedRequest.email,
                    token,
                    expiry: new Date(Date.now() + 24 * 3600 * 1000),
                });

            // define subject and body email
            const verificationLink = `${process.env.BASE_URL}/verify-email?email=${validatedRequest.email}&token=${token}`;
            const subject = "Account Email Verification"
            const body = `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <p>Please click link below to verify your account :</p>
                    <p>${verificationLink}</p>
                    <p>If you did not request this verification, please ignore this email.</p>
                </div>
            `

            // send email
            const sent = sendMail(validatedRequest.email, subject, body)

            if (!sent) {
                throw new HTTPException(500, {
                    message: "Unable to proceed email verification request"
                });
            }

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

            if (user.length === 0) {
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

            // Check if user is verified
            if (!user[0].emailVerified) {
                throw new HTTPException(401, {
                    message: "Email is not verified"
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