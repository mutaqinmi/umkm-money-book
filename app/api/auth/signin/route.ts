import { getUser } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    try {
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

        return NextResponse.json({ 
            message: "success",
        }, { status: 200 });
    } catch(e) {
        return NextResponse.json({ 
            message: "Error occurred",
            error: e
        }, { status: 500 });
    }
}