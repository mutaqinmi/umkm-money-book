import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
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

export function updateBalance(userId: string, balance: number){
    return db.update(table.users).set({
        balance
    }).where(eq(table.users.id, userId)).returning();
}

export function getTransactions(userId: string, limit?: number, offset?: number){
    return db.select().from(table.transactions)
        .where(eq(table.transactions.userId, userId))
        .limit(limit ?? 10)
        .offset(offset ?? 0)
        .orderBy(desc(table.transactions.createdAt));
}

export function getTransactionsWithType(userId: string, transactionType: string, limit?: number){
    return db.select().from(table.transactions)
        .where(and(eq(table.transactions.userId, userId), eq(table.transactions.transactionType, transactionType)))
        .limit(limit ?? 10)
        .orderBy(desc(table.transactions.createdAt));
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

export function editTransaction(id: string, name: string, price: number, description?: string){
    return db.update(table.transactions).set({
        name,
        price,
        description
    }).where(eq(table.transactions.id, id)).returning();
}

export function deleteTransaction(id: string){
    return db.delete(table.transactions)
        .where(eq(table.transactions.id, id));
}

export function getChartData(userId: string) {
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return db
        .select({
            date: table.transactions.date,
            transactionType: table.transactions.transactionType,
            total: sql<number>`SUM(${table.transactions.price})`.as('total'),
        })
        .from(table.transactions)
        .where(
            and(
                eq(table.transactions.userId, userId),
                gte(table.transactions.date, firstDayThisMonth.toISOString().split('T')[0]),
                lte(table.transactions.date, lastDayThisMonth.toISOString().split('T')[0])
            )
        )
        .groupBy(table.transactions.transactionType, table.transactions.date)
        .orderBy(table.transactions.date);
}

export function getTotalTransactionLastMonth(userId: string) {
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return db
        .select({
            transactionType: table.transactions.transactionType,
            total: sql<number>`SUM(${table.transactions.price})`.as('total'),
        })
        .from(table.transactions)
        .where(
            and(
                eq(table.transactions.userId, userId),
                gte(table.transactions.date, firstDayThisMonth.toISOString().split('T')[0]),
                lte(table.transactions.date, lastDayThisMonth.toISOString().split('T')[0])
            )
        )
        .groupBy(table.transactions.transactionType)
}