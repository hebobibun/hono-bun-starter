import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
    userID: text('user_id').primaryKey(),
    fullname: text('fullname').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const sessionsTable = sqliteTable('sessions', {
    sessionID: text('session_id').primaryKey(),
    userID: text('user_id').notNull().references(() => usersTable.userID, {
        onDelete: 'cascade',
    }),
    expires: text('expires').notNull(),
});

export const contactsTable = sqliteTable('contacts', {
    contactID: integer('contact_id').primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name'),
    email: text('email'),
    phone: text('phone'),
    userID: text('user_id').notNull().references(() => usersTable.userID, {
        onDelete: 'cascade',
    }),
});

export const addressesTable = sqliteTable('addresses', {
    addressID: integer('address_id').primaryKey(),
    street: text('street'),
    city: text('city'),
    province: text('province'),
    country: text('country').notNull(),
    postalCode: text('postal_code'),
    contactID: integer('contact_id').notNull().references(() => contactsTable.contactID, {
        onDelete: 'cascade',
    }),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertSession = typeof sessionsTable.$inferInsert;
export type SelectSession = typeof sessionsTable.$inferSelect;

export type InsertContact = typeof contactsTable.$inferInsert;
export type SelectContact = typeof contactsTable.$inferSelect;

export type InsertAddress = typeof addressesTable.$inferInsert;
export type SelectAddress = typeof addressesTable.$inferSelect;
