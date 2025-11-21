import { getUser } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { tokenize } from "@/src/utils/jwt";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const { email, password } = await req.json();

        // check user availability
        const user = await getUser(email);

        if(!user.length){
            return NextResponse.json({ 
                message: "User not found"
            }, { status: 404 });
        }

        // password verification
        const verifiedPassword = await argon2.verify(user[0].password, password);
        if(!verifiedPassword){
            return NextResponse.json({ 
                message: "Invalid credentials"
            }, { status: 401 });
        }

        // generate session token
        const token = tokenize({ id: user[0].id, email: user[0].email });

        (await cookieStore).set("session_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24
        });
        (await cookieStore).set("user_id", user[0].id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24
        });
        return NextResponse.json({ 
            message: "success",
            user: {
                name: user[0].name,
            }
        }, { status: 200 });
    } catch(e) {
        return NextResponse.json({ 
            message: "Error occurred",
            error: e
        }, { status: 500 });
    }
}