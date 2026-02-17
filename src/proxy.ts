import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import api from "./lib/axios";
import axios from "axios";

const PUBLIC_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  console.log("token found from cookie:", token);
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Not logged in → block private routes
  //   if (!token && !isPublicRoute) {
  //     return NextResponse.redirect(new URL('/login', request.url));
  //   }

  // //   Logged in → block login page
  //   if (token && isPublicRoute) {
  //     return NextResponse.redirect(new URL('/dashboard', request.url));
  //   }

  // try {
  //   await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
  //     headers: { cookie: request.headers.get("cookie") || '' },
  //     withCredentials: true, 
  //   });
  //   return NextResponse.next();
  // } catch (err) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
