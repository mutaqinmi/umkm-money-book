import { createTransaction, deleteTransaction, editTransaction, getTransactionById, getTransactions, getTransactionsWithType } from "@/src/db/query";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path/win32";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
    try {
        const user_id = req.cookies.get("user_id")?.value;
        const transaction_type = req.nextUrl.searchParams.get("transaction_type");
        const transaction_id = req.nextUrl.searchParams.get("transaction_id");
        const limit = req.nextUrl.searchParams.get("limit");
        const offset = req.nextUrl.searchParams.get("offset");

        if(!user_id){
            return NextResponse.json({ 
                message: "Missing user_id"
            }, { status: 400 });
        }

        if(transaction_type){
            const transactions = await getTransactionsWithType(user_id, transaction_type, limit ? parseInt(limit) : undefined);

            return NextResponse.json({ 
                message: "success",
                data: transactions
            }, { status: 200 });
        }

        if(transaction_id){
            const transaction = await getTransactionById(transaction_id);

            return NextResponse.json({ 
                message: "success",
                data: transaction
            }, { status: 200 });
        }

        const transactions = await getTransactions(user_id, limit ? parseInt(limit) : undefined, offset ? parseInt(offset) : undefined);

        return NextResponse.json({ 
            message: "success",
            data: transactions
        }, { status: 200 });
    } catch(e) {
        return NextResponse.json({ 
            message: "Error occurred",
            error: e
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user_id = req.cookies.get("user_id")?.value;
        const formData = await req.formData();
        const transactionType = formData.get("transactionType");
        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");
        const receiptImage = formData.get("receiptImage") as File | null;
        let fileName = "";

        if(!user_id){
            return NextResponse.json({ 
                message: "Missing user_id"
            }, { status: 400 });
        }

        if(!transactionType || !name || !price){
            return NextResponse.json({ 
                message: "Missing required fields"
            }, { status: 400 });
        }

        if (receiptImage) {
            const bytes = await receiptImage.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileExtension = receiptImage.name.split('.').pop();
            fileName = `${uuidv4()}.${fileExtension}`;
            
            const uploadDir = path.join(process.cwd(), "public", "uploads", "receipts");
            const filePath = path.join(uploadDir, fileName);

            await mkdir(uploadDir, { recursive: true });

            await writeFile(filePath, buffer);
        }

        const transactionId = uuidv4();
        await createTransaction(
            transactionId, 
            user_id, 
            transactionType as string, 
            name as string, 
            parseFloat(price as string), 
            description as string, 
            fileName
        );

        return NextResponse.json({ 
            message: "Transaction created successfully"
        }, { status: 201 });
    } catch(e) {
        console.log(e);
        return NextResponse.json({ 
            message: "Error occurred",
            error: e
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { transactionType, name, price, description, receiptImage } = await req.json();

        await editTransaction(transactionType, name, price, description, receiptImage);

        return NextResponse.json({ 
            message: "Transaction updated successfully"
        }, { status: 200 });
    } catch(e) {
        return NextResponse.json({ 
            message: "Error occurred",
            error: e
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const transaction_id = req.nextUrl.searchParams.get("transaction_id");

        if(!transaction_id){
            return NextResponse.json({ 
                message: "Missing transaction_id"
            }, { status: 400 });
        }

        await deleteTransaction(transaction_id);

        return NextResponse.json({ 
            message: "Transaction deleted successfully"
        }, { status: 200 });
    } catch(e) {
        return NextResponse.json({ 
            message: "Error occurred",
            error: e
        }, { status: 500 });
    }
}