import { sql } from "drizzle-orm";
import { pgTable, serial, varchar, timestamp, integer, date } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const items = pgTable("items", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => users.id),
    name: varchar("name", { length: 200 }).notNull(),
    price: varchar("price", { length: 50 }).notNull(),
    description: varchar("description", { length: 1000 }),
    date: date("date").default(sql`NOW()`).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type users = typeof users.$inferSelect;
export type items = typeof items.$inferSelect;