import { and, eq } from "drizzle-orm";
import { db } from ".";
import * as table from "./schema";

export function getUser(email: string){
    return db.select().from(table.users)
        .where(eq(table.users.email, email));
}

export function getUserById(id: string){
    return db.select().from(table.users)
        .where(eq(table.users.id, id));
}

export function createUser(id: string, email: string, password: string, name: string){
    return db.insert(table.users).values({
        id,
        name,
        email,
        password
    }).returning();
}

export function getTransactions(userId: string){
    return db.select().from(table.transactions)
        .where(eq(table.transactions.userId, userId));
}

export function getTransactionsWithType(userId: string, transactionType: string){
    return db.select().from(table.transactions)
        .where(and(eq(table.transactions.userId, userId), eq(table.transactions.transactionType, transactionType)));
}

export function getTransactionById(transactionId: string){
    return db.select().from(table.transactions)
        .where(eq(table.transactions.id, transactionId));
}

export function createTransaction(id: string, userId: string, transactionType: string, name: string, price: number, description?: string, receiptImage?: string){
    return db.insert(table.transactions).values({
        id,
        userId,
        transactionType,
        name,
        price,
        description,
        receiptImage
    }).returning();
}

export function editTransaction(id: string, name: string, price: number, description?: string, receiptImage?: string){
    return db.update(table.transactions).set({
        name,
        price,
        description,
        receiptImage
    }).where(eq(table.transactions.id, id)).returning();
}

export function deleteTransaction(id: string){
    return db.delete(table.transactions)
        .where(eq(table.transactions.id, id));
}