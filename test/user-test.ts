import { describe, expect, it } from "bun:test";
import app from "../src";

describe('POST /api/users', () => {
    it('should reject register user if request is invalid', async () => {
        const response = await app.request('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                fullname: "",
                email: "",
                password: "",
            }),
        })

        expect(response.status).toBe(400)
        // expect(res.errors).toBeDefined()
    })

    it('should reject register user if email already exists', async () => {
        const response = await app.request('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                fullname: "John Doe",
                email: "john@example.com",
                password: "password",
            }),
        })

        expect(response.status).toBe(400)
        // expect(res.errors).toBeDefined()

    })

    it('should successfully register a new user', async () => {
        const emailRandom = crypto.randomUUID().slice(0, 10) + "@example.com";
        const response = await app.request('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                fullname: "John Doe",
                email: emailRandom,
                password: "password",
            }),
        })

        expect(response.status).toBe(200)
    })
})