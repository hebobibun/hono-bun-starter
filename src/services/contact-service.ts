import { Context } from "hono";
import { CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "../model/contact-model";
import { ContactRepository } from "../repositories/contact-repository";

export class ContactService {
    async createContact(c: Context) {
        const user = c.get('user') as string;
        const request = await c.req.json() as CreateContactRequest;
        const response = await ContactRepository.createContact(user, request);
    
        return c.json({
            data: response,
        });
    }
    
    async getContact(c: Context) {
        const user = c.get('user') as string;
        const contactID = c.req.param('id');
    
        if (!contactID) {
            return c.json({
                errors: "Invalid contact ID"
            }, 400);
        }
    
        const contactIDNumber = parseInt(contactID);
        const response = await ContactRepository.getContact(user, contactIDNumber);
    
        return c.json({
            data: response,
        });
    }
    
    async updateContact(c: Context) {
        const user = c.get('user') as string;
        const contactID = c.req.param('id');
    
        if (!contactID) {
            return c.json({
                errors: "Invalid contact ID"
            }, 400);
        }
    
        const request = await c.req.json() as UpdateContactRequest;
    
        request.contactID = parseInt(contactID);
        const response = await ContactRepository.updateContact(user, request);
    
        return c.json({
            data: response,
        });
    }
    
    async deleteContact(c: Context) {
        const user = c.get('user') as string;
        const contactID = c.req.param('id');
    
        if (!contactID) {
            return c.json({
                errors: "Invalid contact ID"
            }, 400);
        }
    
        const contactIDNumber = parseInt(contactID);
        const response = await ContactRepository.deleteContact(user, contactIDNumber);
    
        return c.json({
            data: response,
        });
    }
    
    // search contact by filter
    async searchContact(c: Context) {
        const user = c.get('user') as string;
        const request: SearchContactRequest = {
            name: c.req.query('name'),
            email: c.req.query('email'),
            phone: c.req.query('phone'),
            page: c.req.query('page') ? Number(c.req.query('page')) : 1,
            size: c.req.query('size') ? Number(c.req.query('size')) : 10,
        }
    
        const response = await ContactRepository.searchContact(user, request);
    
        return c.json({
            data: response,
        });
    }
}