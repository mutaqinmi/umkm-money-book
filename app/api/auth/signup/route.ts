import { createUser, getUser } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";

export async function POST(req: NextRequest) {
    const { email, password, name } = await req.json();

    try {
        // check user availability
        const user = await getUser(email);

        if(user.length){
            return NextResponse.json({ 
                message: "User already registered"
            }, { status: 409 });
        }

        // hash password
        const hashedPassword = await argon2.hash(password);

        // create new user
        await createUser(email, hashedPassword, name);

        return NextResponse.json({
            message: "success",
        }, { status: 201 });
    } catch(e) {
        return NextResponse.json({ 
            message: "Error occurred",
            error: e
        }, { status: 500 });
    }
}