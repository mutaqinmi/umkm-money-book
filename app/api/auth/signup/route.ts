import { createUser, getUser } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { tokenize } from "@/src/utils/jwt";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const { email, password, name } = await req.json();
        
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
        const userId = uuidv4();
        await createUser(userId, email, hashedPassword, name);

        // generate session token
        const token = tokenize({ id: userId, email: email });

        (await cookieStore).set("session_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24
        });
        (await cookieStore).set("user_id", userId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24
        });
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