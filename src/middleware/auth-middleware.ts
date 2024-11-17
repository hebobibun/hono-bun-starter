import { MiddlewareHandler } from "hono";
import { AuthService } from "../service/auth-service";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const session_id = c.req.header('Authorization');

    if (!session_id) {
        return c.json({
            errors: 'Unauthorized request'
        }, 401);
    }

    const token = session_id.split(' ')[1];
    const userID = await AuthService.verifyToken(token);

    // check if userID is valid
    if (!userID) {
        return c.json({
            errors: 'Unauthorized request'
        }, 401);
    }

    c.set('user', userID);

    await next();
}