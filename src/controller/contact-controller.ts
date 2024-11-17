import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth-middleware";
import { CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "../model/contact-model";
import { ContactService } from "../service/contact-service";

const baseUrl = "/api/contacts";

type Variables = {
    user: string; 
};

export const contactController = new Hono<{ Variables: Variables }>();;
contactController.use(authMiddleware);

contactController.post(baseUrl, async (c) => {
    const user = c.get('user') as string;
    const request = await c.req.json() as CreateContactRequest;
    const response = await ContactService.createContact(user, request);

    return c.json({
        data: response,
    });
})

contactController.get(baseUrl+"/:id", async (c) => {
    const user = c.get('user') as string;
    const contactID = c.req.param('id');

    if (!contactID) {
        return c.json({
            errors: "Invalid contact ID"
        }, 400);
    }

    const contactIDNumber = parseInt(contactID);
    const response = await ContactService.getContact(user, contactIDNumber);

    return c.json({
        data: response,
    });
})

contactController.put(baseUrl+"/:id", async (c) => {
    const user = c.get('user') as string;
    const contactID = c.req.param('id');

    if (!contactID) {
        return c.json({
            errors: "Invalid contact ID"
        }, 400);
    }

    const request = await c.req.json() as UpdateContactRequest;

    request.contactID = parseInt(contactID);
    const response = await ContactService.updateContact(user, request);

    return c.json({
        data: response,
    });
})

contactController.delete(baseUrl+"/:id", async (c) => {
    const user = c.get('user') as string;
    const contactID = c.req.param('id');

    if (!contactID) {
        return c.json({
            errors: "Invalid contact ID"
        }, 400);
    }

    const contactIDNumber = parseInt(contactID);
    const response = await ContactService.deleteContact(user, contactIDNumber);

    return c.json({
        data: response,
    });
})

// search contact by filter
contactController.get(baseUrl, async (c) => {
    const user = c.get('user') as string;
    const request: SearchContactRequest = {
        name: c.req.query('name'),
        email: c.req.query('email'),
        phone: c.req.query('phone'),
        page: c.req.query('page') ? Number(c.req.query('page')) : 1,
        size: c.req.query('size') ? Number(c.req.query('size')) : 10,
    }

    const response = await ContactService.searchContact(user, request);

    return c.json({
        data: response,
    });
})