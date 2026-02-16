import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  console.log("token found from cookie:", token);
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
