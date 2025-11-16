import { sql } from "drizzle-orm";
import { pgTable, varchar, timestamp, integer, date } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: varchar("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    balance: integer("balance").default(0).notNull(),
    profileImage: varchar("profile_image", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const transactions = pgTable("transactions", {
    id: varchar("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    transactionType: varchar("transaction_type", { length: 50 }).notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    price: integer("price").default(0).notNull(),
    description: varchar("description", { length: 1000 }),
    date: date("date").default(sql`NOW()`).notNull(),
    receiptImage: varchar("receipt_image", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type users = typeof users.$inferSelect;
export type transactions = typeof transactions.$inferSelect;