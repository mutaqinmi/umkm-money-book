import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./src/utils/jwt";

export default async function proxy(req: NextRequest){
    if(req.nextUrl.pathname.startsWith("/api/auth")){
        return NextResponse.next();
    }

    const sessionToken = req.cookies.get("session_token")?.value;
    if (!sessionToken){
        return NextResponse.json({ 
            message: "Unauthorized"
        }, { status: 401 });
    }
    
    const verifiedToken = verifyToken(sessionToken);
    if (!verifiedToken){
        return NextResponse.json({ 
            message: "Unauthorized"
        }, { status: 401 });
    }

    const authenticated = sessionToken && verifiedToken;

    if (authenticated && (req.nextUrl.pathname.startsWith("/signin") || req.nextUrl.pathname.startsWith("/signup"))){
        return NextResponse.redirect(new URL("/", req.url));
    } else if (!authenticated && !req.nextUrl.pathname.startsWith("/signin") && !req.nextUrl.pathname.startsWith("/signup")) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if(!authenticated && req.nextUrl.pathname.startsWith("/api")){
        return NextResponse.json({ 
            message: "Unauthorized"
        }, { status: 401 });
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}