

export type CreateContactRequest = {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export type UpdateContactRequest = {
    contactID: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export type SearchContactRequest = {
    name?: string;
    email?: string;
    phone?: string;
    page: number;
    size: number;
}

export interface PaginationResult<T> {
    data: T[];
    paging: {
        page: number;
        total_pages: number;
        total_items: number;
        size: number;
    };
}

export type ContactResponse = {
    contactID: number;
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export const toContactResponse = (contact: any): ContactResponse => {
    return {
        contactID: contact.contactID,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
    }
}