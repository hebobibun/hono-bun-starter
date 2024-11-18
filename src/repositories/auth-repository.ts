import { and, eq } from "drizzle-orm";
import { db } from "../application/db";
import { emailVerificationsTable, sessionsTable, usersTable } from "../application/db/schema";
import { AuthValidation } from "../validation/auth-validation";
import { HTTPException } from "hono/http-exception";
import { verifyEmailRequest } from "../model/user-model";
import { ZodError } from "zod";
import { sendMail } from "../utils/mail-sender";

export class AuthRepository {
    static async verifyToken(session_id: string | undefined | null): Promise<string> {
        try {
            // Validate session ID format
            const validatedResult = AuthValidation.SESSION.safeParse(session_id);
            
            // Check if session ID is valid
            if (!validatedResult.success) {
                throw new HTTPException(401, {
                    message: "Unauthorized request 1"
                });
            }

            // Get session from database
            const session = await db
                .select()
                .from(sessionsTable)
                .where(eq(
                    sessionsTable.sessionID,
                    validatedResult.data
                ))
                .limit(1);

            // Check if session exists
            if (session.length === 0) {
                throw new HTTPException(401, {
                    message: "Unauthorized request 2"
                });
            }

            // Check if session is expired
            const currentTime = new Date(Date.now());
            if (session[0].expiry < currentTime) {
                // Optionally clean up expired session
                await db
                    .delete(sessionsTable)
                    .where(eq(sessionsTable.sessionID, validatedResult.data));

                throw new HTTPException(401, {
                    message: "Session expired"
                });
            }

            return session[0].userID;

        } catch (error) {
            // Pass through HTTP exceptions
            if (error instanceof HTTPException) {
                throw error;
            }

            // Log unexpected errors
            console.error('Error in verifyToken:', error);
            throw new HTTPException(500, {
                message: "Internal server error"
            });
        }
    }

    static async invalidateToken(session_id: string): Promise<void> {
        try {
            // Validate session ID format
            const validatedResult = AuthValidation.SESSION.safeParse(session_id);
            
            // Check if session ID is valid
            if (!validatedResult.success) {
                throw new HTTPException(400, {
                    message: "Invalid session token format"
                });
            }

            // Delete session from database
            await db
                .delete(sessionsTable)
                .where(eq(sessionsTable.sessionID, validatedResult.data));

        } catch (error) {
            // Pass through HTTP exceptions
            if (error instanceof HTTPException) {
                throw error;
            }

            // Log unexpected errors
            console.error('Error in invalidateToken:', error);
            throw new HTTPException(500, {
                message: "Internal server error"
            });
        }
    }

    // request email verification
    static async requestEmailVerification(request: verifyEmailRequest): Promise<boolean> {
        try {
            // Validate token format by token and email
            const validatedResult = AuthValidation.REQUEST_EMAIL_VERIFICATION.parse(request);

            // check if user exists
            const user = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.email, validatedResult.email))
                .limit(1);

            if (user.length === 0) {
                throw new HTTPException(404, {
                    message: "User with this email not found"
                });
            }

            // check if user is verified
            if (user[0].emailVerified) {
                throw new HTTPException(400, {
                    message: "User is already verified"
                });
            }

            // check if user has email verification request
            const emailVerification = await db
                .select()
                .from(emailVerificationsTable)
                .where(eq(emailVerificationsTable.email, validatedResult.email))
                .limit(1);

            const currentTime = new Date(Date.now());
            if (emailVerification.length > 0 && emailVerification[0].expiry > currentTime) {
                throw new HTTPException(429, {
                    message: "You have already requested email verification"
                });
            }

            // generate token for email verification
            const token = crypto.randomUUID();
            const expiry = new Date(Date.now() + 24 * 3600 * 1000);

            // store email verication
            await db
                .insert(emailVerificationsTable)
                .values({
                    userID: user[0].userID,
                    email: validatedResult.email,
                    token,
                    expiry: expiry,
                })
                .onConflictDoUpdate({
                    target: emailVerificationsTable.userID, 
                    set: {
                        expiry: expiry,
                        token: token,
                    }
                });

            // define subject and body email
            const verificationLink = `${process.env.BASE_URL}/verify-email?email=${validatedResult.email}&token=${token}`;
            const subject = "Account Email Verification"
            const body = `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <p>Please click link below to verify your account :</p>
                    <p>${verificationLink}</p>
                    <p>If you did not request this verification, please ignore this email.</p>
                </div>
            `

            // send email
            const sent = sendMail(validatedResult.email, subject, body)

            if (!sent) {
                throw new HTTPException(500, {
                    message: "Unable to proceed email verification request"
                });
            }

            return true;

        } catch (error) {
            // Handle Zod validation errors
            if (error instanceof ZodError) {
                throw new HTTPException(400, {
                    message: "Validation failed",
                });
            }

            // Pass through HTTP exceptions
            if (error instanceof HTTPException) {
                throw error;
            }

            // Log unexpected errors
            console.error('Error in requestEmailVerification:', error); 
            throw new HTTPException(500, {
                message: "Internal server error"
            });
        }
    }

    // verify email
    static async verifyEmail(request: verifyEmailRequest): Promise<boolean> {
        try {
            // Validate token format by token and email
            const validatedResult = AuthValidation.VERIFY_EMAIL.safeParse(request);

            // Get email verification from database by token and email
            const verification = await db
                .select()
                .from(emailVerificationsTable)
                .where(and(
                    eq(emailVerificationsTable.token, validatedResult.data.token),
                    eq(emailVerificationsTable.email, validatedResult.data.email)
                ))
                .limit(1);

            // check if any record exists
            if (verification.length === 0) {
                throw new HTTPException(404, {
                    message: "Email verification not found"
                });
            }

            // check if token is expired
            const currentTime = new Date(Date.now());
            if (verification[0].expiry < currentTime) {
                throw new HTTPException(400, {
                    message: "Token expired"
                });
            }

            // update user emailVerified to true
            await db
                .update(usersTable)
                .set({
                    emailVerified: true,
                })
                .where(eq(usersTable.userID, verification[0].userID));

            return true;

        } catch (error) {
            // Handle Zod validation errors
            if (error instanceof ZodError) {
                throw new HTTPException(400, {
                    message: "Validation failed",
                });
            }

            // Pass through HTTP exceptions
            if (error instanceof HTTPException) {
                throw error;
            }

            // Log unexpected errors
            console.error('Error in verifyEmail:', error);
            throw new HTTPException(500, {
                message: "Internal server error"
            });
        }
    }
}