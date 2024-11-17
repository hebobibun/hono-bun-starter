import { eq } from "drizzle-orm";
import { db } from "../application/db";
import { sessionsTable } from "../application/db/schema";
import { AuthValidation } from "../validation/auth-validation";
import { HTTPException } from "hono/http-exception";

export class AuthService {
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
}