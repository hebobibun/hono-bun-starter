import { describe, expect, it } from "bun:test";
import app from "../src";

const firstBearerToken = process.env.TEST_BEARER_TOKEN1;
const secondBearerToken = process.env.TEST_BEARER_TOKEN2;

// create contact
describe('POST /api/contacts', () => {
    // invalid authorization
    it('should reject create contact if user is not authorized', async () => {
        const emailRandom = crypto.randomUUID().slice(0, 10) + "@example.com";
        const response = await app.request('/api/contacts', {
            method: 'POST',
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: emailRandom,
                phone: "123456789",
            }),
        })

        expect(response.status).toBe(401)
        // expect(res.errors).toBeDefined()
    })

    it('should reject create contact if request is invalid', async () => {
        const response = await app.request('/api/contacts', {
            method: 'POST',
            body: JSON.stringify({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
            }),
            headers: {
                Authorization: `Bearer ${firstBearerToken}`
            }
        })

        expect(response.status).toBe(400)
        // expect(res.errors).toBeDefined()
    })

    // invalid email format
    it('should reject create contact if email is invalid', async () => {
        const response = await app.request('/api/contacts', {
            method: 'POST',
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: "john.example.com",
                phone: "123456789",
            }),
            headers: {
                Authorization: `Bearer ${firstBearerToken}`
            }
        })

        expect(response.status).toBe(400)
        // expect(res.errors).toBeDefined()
    })

    // success case
    it('should successfully create a new contact', async () => {
        const emailRandom = crypto.randomUUID().slice(0, 10) + "@example.com";
        const response = await app.request('/api/contacts', {
            method: 'POST',
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: emailRandom,
                phone: "123456789",
            }),
            headers: {
                Authorization: `Bearer ${firstBearerToken}`
            }
        })

        expect(response.status).toBe(200)
    })
})

// get contact
describe('GET /api/contacts/:id', () => {
    // invalid authorization
    it('should reject get contact if user is not authorized', async () => {
        const response = await app.request('/api/contacts/1', {
            method: 'GET',
        })

        expect(response.status).toBe(401)
        // expect(res.errors).toBeDefined()
    })

    it('should reject get contact if contact ID is invalid', async () => {
        const response = await app.request('/api/contacts/abc', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${firstBearerToken}`
            }
        })

        expect(response.status).toBe(400)
        // expect(res.errors).toBeDefined()
    })

    it('should reject get contact if user is not authorized', async () => {
        const response = await app.request('/api/contacts/1', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secondBearerToken}`
            }
        })

        expect(response.status).toBe(403)
        // expect(res.errors).toBeDefined()
    })

    // success case
    it('should successfully get a contact', async () => {
        const emailRandom = crypto.randomUUID().slice(0, 10) + "@example.com";
        const response = await app.request('/api/contacts/1', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${firstBearerToken}`
            }
        })

        expect(response.status).toBe(200)
    })
})

// update contact
describe('PUT /api/contacts/:id', () => {
    // invalid authorization
    it('should reject update contact if user is not authorized', async () => {
        const response = await app.request('/api/contacts/1', {
            method: 'PUT',
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                phone: "123456789",
            }),
        })

        expect(response.status).toBe(401)
        // expect(res.errors).toBeDefined()
    })

    it('should reject update contact if contact ID is invalid', async () => {
        const response = await app.request('/api/contacts/abc', {
            method: 'PUT',
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                phone: "123456789",
            }),
            headers: {
                Authorization: `Bearer ${firstBearerToken}`
            }
        })

        expect(response.status).toBe(400)
        // expect(res.errors).toBeDefined()
    })

    // invalid email format
    it('should reject update contact if email is invalid', async () => {
        const response = await app.request('/api/contacts/1', {
            method: 'PUT',
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: "john.example.com",
                phone: "123456789",
            }),
            headers: {
                Authorization: `Bearer ${firstBearerToken}`
            }
        })

        expect(response.status).toBe(400)
        // expect(res.errors).toBeDefined()
    })

    it('should reject update contact if user is not authorized', async () => {
        const response = await app.request('/api/contacts/1', {
            method: 'PUT',
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                phone: "123456789",
            }),
            headers: {
                Authorization: `Bearer ${secondBearerToken}`
            }
        })

        expect(response.status).toBe(403)
        // expect(res.errors).toBeDefined()
    })

    // success case
    it('should successfully update a contact', async () => {
        const response = await app.request('/api/contacts/1', {
            method: 'PUT',
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                phone: "123456789",
            }),
            headers: {
                Authorization: `Bearer ${firstBearerToken}`
            }
        })

        expect(response.status).toBe(200)
    })
})

// delete contact
describe('DELETE /api/contacts/:id', () => {
    // invalid authorization
    it('should reject delete contact if user is not authorized', async () => {
        const response = await app.request('/api/contacts/1', {
            method: 'DELETE',
        })

        expect(response.status).toBe(401)
        // expect(res.errors).toBeDefined()
    })

    it('should reject delete contact if contact ID is invalid', async () => {
        const response = await app.request('/api/contacts/abc', {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${firstBearerToken}`
            }
        })

        expect(response.status).toBe(400)
        // expect(res.errors).toBeDefined()
    })

    it('should reject delete contact if user is not authorized', async () => {
        const response = await app.request('/api/contacts/1', {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${secondBearerToken}`
            }
        })

        expect(response.status).toBe(403)
        // expect(res.errors).toBeDefined()
    })

    // success case
    it('should successfully delete a contact', async () => {
        const response = await app.request('/api/contacts/1', {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${firstBearerToken}`
            }
        })

        expect(response.status).toBe(200)
    })
})