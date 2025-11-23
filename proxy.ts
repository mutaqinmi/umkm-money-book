import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./src/utils/jwt";

export async function proxy(req: NextRequest){
    if(req.nextUrl.pathname.startsWith("/api/auth")){
        return NextResponse.next();
    }

    const sessionToken = req.cookies.get("session_token")?.value;
    const verifiedToken = sessionToken ? verifyToken(sessionToken) : false;

    const authenticated = sessionToken && verifiedToken;
    const authPages = [
        "/auth/signin",
        "/auth/signup",
        "/auth/signout"
    ];

    if (req.nextUrl.pathname.startsWith("/api")){
        if(!authenticated){
            return NextResponse.json({
            message: "Unauthorized"
        }, { status: 401 } );
        }

        return NextResponse.next();
    }

    if (authenticated && authPages.includes(req.nextUrl.pathname)){
        return NextResponse.redirect(new URL("/", req.url));
    } 
    
    if (!authenticated){
        if (authPages.includes(req.nextUrl.pathname)){
            return NextResponse.next();
        }
        
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}