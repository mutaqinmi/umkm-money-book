import { getUserById } from "@/src/db/query";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookie = await cookies();
        const userId = cookie.get("user_id")?.value;

        if (!userId) {
            return NextResponse.json({
                message: "No user logged in",
            }, { status: 401 });
        }

        const user = await getUserById(userId);

        if (!user.length) {
            return NextResponse.json({
                message: "User not found",
            }, { status: 404 });
        }

        const { password, ...userData } = user[0];

        return NextResponse.json({
            message: "success",
            user: {
                ...userData,
            },
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json({
            message: "Error occurred",
            error: e,
        },{ status: 500 });
    }
}
