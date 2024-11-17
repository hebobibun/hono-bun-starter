import { Hono } from "hono";
import { LoginUserRequest, RegisterUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";

export const userController =  new Hono();

const baseUrl = "/api/users";

userController.post(baseUrl, async (c) => {
    const request = await c.req.json() as RegisterUserRequest;

    // send request to service
    const response = await UserService.registerUser(request);

    // return response
    return c.json({data: response});
})

userController.post(baseUrl + "/login", async (c) => {
    const request = await c.req.json() as LoginUserRequest;

    // send request to service
    const response = await UserService.loginUser(request);

    // return response
    return c.json({data: response});
})