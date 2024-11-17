import { and, eq, like, SQL, sql } from "drizzle-orm";
import { db } from "../application/db";
import { contactsTable } from "../application/db/schema";
import { ContactResponse, CreateContactRequest, PaginationResult, SearchContactRequest, toContactResponse, UpdateContactRequest } from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";


export class ContactService {

    static async createContact(user: string, request: CreateContactRequest): Promise<ContactResponse> {
        try {
            const validatedRequest = ContactValidation.CREATE.parse(request);
            
            const data = {
                ...validatedRequest,
                userID: user
            };

            const contact = await db
                .insert(contactsTable)
                .values(data)
                .returning();

            return toContactResponse(contact[0]);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new HTTPException(400, {
                    message: "Validation failed",
                });
            }

            if (error instanceof HTTPException) throw error;
            
            console.error('Error in createContact:', error);
            throw new HTTPException(500, {
                message: "Failed to create contact"
            });
        }
    }

    static async getContact(userID: string, contactID: number): Promise<ContactResponse> {
        try {
            const validatedRequest = ContactValidation.EXISTING.parse({ contactID });
            const contact = await this.verifyContactOwnership(contactID, userID);
            return toContactResponse(contact);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new HTTPException(400, {
                    message: "Validation failed",
                });
            }

            if (error instanceof HTTPException) throw error;
            
            console.error('Error in getContact:', error);
            throw new HTTPException(500, {
                message: "Failed to retrieve contact"
            });
        }
    }

    static async updateContact(userID: string, request: UpdateContactRequest): Promise<ContactResponse> {
        try {
            const validatedRequest = ContactValidation.UPDATE.parse(request);
            
            await this.verifyContactOwnership(validatedRequest.contactID, userID);

            // Remove contactID from update data
            const { contactID, ...updateData } = validatedRequest;

            const updated = await db
                .update(contactsTable)
                .set({
                    ...updateData,
                    updatedAt: new Date()
                })
                .where(eq(contactsTable.contactID, contactID))
                .returning();

            return toContactResponse(updated[0]);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new HTTPException(400, {
                    message: "Validation failed",
                });
            }

            if (error instanceof HTTPException) throw error;
            
            console.error('Error in updateContact:', error);
            throw new HTTPException(500, {
                message: "Failed to update contact"
            });
        }
    }

    static async deleteContact(userID: string, contactID: number): Promise<void> {
        try {
            const validatedRequest = ContactValidation.EXISTING.parse({ contactID });
            await this.verifyContactOwnership(validatedRequest.contactID, userID);

            await db
                .delete(contactsTable)
                .where(eq(contactsTable.contactID, contactID));
        } catch (error) {
            if (error instanceof ZodError) {
                throw new HTTPException(400, {
                    message: "Validation failed",
                });
            }

            if (error instanceof HTTPException) throw error;
            
            console.error('Error in deleteContact:', error);
            throw new HTTPException(500, {
                message: "Failed to delete contact"
            });
        }
    }

    private static async verifyContactOwnership(contactID: number, userID: string): Promise<any> {
        const contact = await db
            .select()
            .from(contactsTable)
            .where(eq(contactsTable.contactID, contactID))
            .limit(1);

        if (contact.length === 0) {
            throw new HTTPException(404, {
                message: "Contact not found"
            });
        }

        if (contact[0].userID !== userID) {
            throw new HTTPException(403, {
                message: "You don't have permission to access this contact"
            });
        }

        return contact[0];
    }

    // search contact by filter
    static async searchContact(userID: string, request: SearchContactRequest): Promise<PaginationResult<ContactResponse>> {
        try {
            // Validate request
            const validatedRequest = ContactValidation.SEARCH.parse(request);
            
            // Build where conditions
            const conditions: SQL[] = [eq(contactsTable.userID, userID)];

            if (validatedRequest.name) {
                conditions.push(like(contactsTable.firstName, `%${validatedRequest.name}%`));
                conditions.push(like(contactsTable.lastName, `%${validatedRequest.name}%`));
            }

            if (validatedRequest.email) {
                conditions.push(like(contactsTable.email, `%${validatedRequest.email}%`));
            }

            if (validatedRequest.phone) {
                conditions.push(like(contactsTable.phone, `%${validatedRequest.phone}%`));
            }

            // Calculate pagination
            const offset = (validatedRequest.page - 1) * validatedRequest.size;

            // Get total count for pagination
            const totalCount = await db
                .select({ count: sql<number>`count(*)` })
                .from(contactsTable)
                .where(and(...conditions))
                .then(result => result[0].count);

            // Get paginated results
            const contacts = await db
                .select()
                .from(contactsTable)
                .where(and(...conditions))
                .limit(validatedRequest.size)
                .offset(offset)
                .orderBy(contactsTable.firstName);

            // Calculate total pages
            const totalPages = Math.ceil(totalCount / validatedRequest.size);

            // Transform to response format
            return {
                data: contacts.map(contact => ({
                    contactID: contact.contactID,
                    firstName: contact.firstName,
                    email: contact.email || undefined,
                    phone: contact.phone || undefined,
                })),
                paging: {
                    page: validatedRequest.page,
                    total_pages: totalPages,
                    total_items: totalCount,
                    size: validatedRequest.size
                }
            };

        } catch (error) {
            if (error instanceof ZodError) {
                throw new HTTPException(400, {
                    message: "Validation failed",
                });
            }

            if (error instanceof HTTPException) {
                throw error;
            }

            console.error('Error in searchContact:', error);
            throw new HTTPException(500, {
                message: "Failed to search contacts"
            });
        }
    }
}