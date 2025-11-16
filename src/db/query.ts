import { eq } from "drizzle-orm";
import { db } from ".";
import * as table from "./schema";

export async function getUser(email: string){
    return await db.select().from(table.users).where(eq(table.users.email, email));
}

export async function createUser(email: string, password: string, name: string){
    return await db.insert(table.users).values({
        name,
        email,
        password
    }).returning();
}