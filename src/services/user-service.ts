import { LoginUserRequest, RegisterUserRequest, verifyEmailRequest } from "../model/user-model";
import { AuthRepository } from "../repositories/auth-repository";
import { UserRepository } from "../repositories/user-repository";
import { Context } from "hono";


export class UserService {

    async registerUser(c: Context) {
        const request = await c.req.json() as RegisterUserRequest;

        // send request to service
        const response = await UserRepository.registerUser(request);

        // return response
        return c.json({data: response});
    }

    async loginUser(c: Context) {
        const request = await c.req.json() as LoginUserRequest;

        // send request to service
        const response = await UserRepository.loginUser(request);

        // return response
        return c.json({data: response});
    }

    async requestEmailVerification(c: Context) {
        const request = await c.req.json() as verifyEmailRequest

        const response = await AuthRepository.requestEmailVerification(request)

        return c.json({data: response})
    }

    async verifyEmail(c: Context) {
        const request: verifyEmailRequest = {
            token: c.req.query('token'),
            email: c.req.query('email'),
        }
    
        const response = await AuthRepository.verifyEmail(request)
    
        return c.html(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verified</title>
                <style>
                    body {
                        font-family: system-ui, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        background: #f3f4f6;
                    }
                    .card {
                        background: white;
                        padding: 2rem;
                        border-radius: 6px;
                        text-align: center;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    .title {
                        color: #059669;
                        margin: 0 0 1rem;
                    }
                    .text {
                        color: #4b5563;
                        margin: 0;
                    }
                    .link {
                        display: inline-block;
                        margin-top: 1.5rem;
                        color: #059669;
                        text-decoration: none;
                    }
                    .link:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1 class="title">Email Verified</h1>
                    <p class="text">Your account has been successfully verified.</p>
                    <a href="${process.env.FRONTEND_URL}/login" class="link">Continue to Login →</a>
                </div>
            </body>
            </html>
        `);
    }

}