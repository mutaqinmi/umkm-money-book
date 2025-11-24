import { createTransaction, deleteTransaction, editTransaction, getTransactionById, getTransactions, getTransactionsWithType, getUserById, updateBalance } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

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
        
        if(!user_id){
            return NextResponse.json({ 
                message: "Missing user_id"
            }, { status: 400 });
        }

        const formData = await req.formData();
        const transactionType = formData.get("transactionType");
        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");
        const receiptImage = formData.get("receiptImage") as File | undefined;
        let fileName: string | undefined = undefined;
        
        const user = await getUserById(user_id);

        if(user.length === 0){
            return NextResponse.json({ 
                message: "User not found"
            }, { status: 404 });
        }

        if(!transactionType || !name || !price){
            return NextResponse.json({ 
                message: "Missing required fields"
            }, { status: 400 });
        }

        if (receiptImage) {
            const bytes = await receiptImage.arrayBuffer();
        
            const fileExtension = receiptImage.name.split('.').pop();
            fileName = `receipts/${uuidv4()}.${fileExtension}`;
            
            // Upload to R2
            await r2.send(new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: fileName,
                Body: Buffer.from(bytes),
                ContentType: receiptImage.type,
            }));
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

        await updateBalance(user_id, user[0].balance + (transactionType === "pemasukan" ? parseFloat(price as string) : -parseFloat(price as string)));

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
        const user_id = req.cookies.get("user_id")?.value;
        
        if(!user_id){
            return NextResponse.json({ 
                message: "Missing user_id"
            }, { status: 400 });
        }

        const formData = await req.formData();
        const transactionId = formData.get("transactionID");
        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");
        
        const user = await getUserById(user_id);

        if(user.length === 0){
            return NextResponse.json({ 
                message: "User not found"
            }, { status: 404 });
        }
        
        if(!transactionId){
            return NextResponse.json({ 
                message: "Missing transaction_id"
            }, { status: 400 });
        }

        const transaction = await getTransactionById(transactionId as string);
        
        if(transaction.length > 0){
            let newBalance = user[0].balance;
            if(transaction[0].transactionType === "pemasukan"){
                newBalance -= transaction[0].price;
            } else {
                newBalance += transaction[0].price;
            }
            newBalance += parseFloat(price as string) * (transaction[0].transactionType === "pemasukan" ? 1 : -1);

            await updateBalance(user_id, newBalance);
        }

        await editTransaction(
            transactionId as string, 
            name as string, 
            parseFloat(price as string), 
            description as string, 
        );

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

        const transaction = await getTransactionById(transaction_id);
        
        if(transaction.length === 0){
            return NextResponse.json({ 
                message: "Transaction not found"
            }, { status: 404 });
        }

        const user = await getUserById(transaction[0].userId);
        if(user.length === 0){
            return NextResponse.json({ 
                message: "User not found"
            }, { status: 404 });
        }

        let newBalance = user[0].balance;
        if(transaction[0].transactionType === "pemasukan"){
            newBalance -= transaction[0].price;
        } else {
            newBalance += transaction[0].price;
        }
        await updateBalance(user[0].id, newBalance);

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