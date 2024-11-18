import { Hono } from "hono";
import { UserService } from "../../application/services/user-service";

const userService = new UserService();

export const userRouter =  new Hono();
const baseUrl = "/api/users";

userRouter.post(baseUrl, userService.registerUser)
userRouter.post(baseUrl + "/login", userService.loginUser)
userRouter.post(baseUrl + "/verify-email", userService.requestEmailVerification)
userRouter.get('/verify-email', userService.verifyEmail)