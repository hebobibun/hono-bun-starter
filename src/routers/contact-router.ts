import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth-middleware";
import { CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "../model/contact-model";
import { ContactRepository } from "../repositories/contact-repository";
import { ContactService } from "../services/contact-service";

const contactService = new ContactService();

type Variables = {
    user: string; 
};

export const contactRouter = new Hono<{ Variables: Variables }>();
const baseUrl = "/api/contacts";

contactRouter.use(authMiddleware);
contactRouter.post(baseUrl, contactService.createContact)
contactRouter.get(baseUrl+"/:id", contactService.getContact)
contactRouter.put(baseUrl+"/:id", contactService.updateContact)
contactRouter.delete(baseUrl+"/:id", contactService.deleteContact)
contactRouter.get(baseUrl, contactService.searchContact)