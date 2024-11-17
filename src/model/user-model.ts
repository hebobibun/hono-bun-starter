import { SelectUser } from "../application/db/schema";

export type RegisterUserRequest = {
    userID?: string;
    fullname: string;
    email: string;
    password: string;
}

export type LoginUserRequest = {
    email: string;
    password: string;
}

export type UserResponse = {
    fullname: string;
    email: string;
    session_id?: string;
}

export function toUserResponse(user: SelectUser, sessionID?: string): UserResponse {
    return {
        fullname: user.fullname,
        email: user.email,
        session_id: sessionID,
    }
}