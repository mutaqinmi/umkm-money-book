import { createTransaction, deleteTransaction, editTransaction, getTransactionById, getTransactions, getTransactionsWithType } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
    try {
        const user_id = req.cookies.get("user_id")?.value;
        const transaction_type = req.nextUrl.searchParams.get("transaction_type");
        const transaction_id = req.nextUrl.searchParams.get("transaction_id");

        if(!user_id){
            return NextResponse.json({ 
                message: "Missing user_id"
            }, { status: 400 });
        }

        if(transaction_type){
            const transactions = await getTransactionsWithType(user_id, transaction_type);

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

        const transactions = await getTransactions(user_id);

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
        const { transactionType, name, price, description, receiptImage } = await req.json();

        if(!user_id){
            return NextResponse.json({ 
                message: "Missing user_id"
            }, { status: 400 });
        }

        const transactionId = uuidv4();
        await createTransaction(transactionId, user_id, transactionType, name, price, description, receiptImage);

        return NextResponse.json({ 
            message: "Transaction created successfully"
        }, { status: 201 });
    } catch(e) {
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