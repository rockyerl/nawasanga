//  Fitur Auth
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
//
// export function proxy(request: NextRequest) {
//   const isLoggedIn = request.cookies.get("is_logged_in")?.value === "true";
//   const { pathname } = request.nextUrl;
//
//   if (!isLoggedIn && pathname !== "/auth") {
//     return NextResponse.redirect(new URL("/auth", request.url));
//   }
//
//   if (isLoggedIn && pathname === "/auth") {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }
//
//   return NextResponse.next();
// }
//
// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth disabled: redirect /auth langsung ke dashboard
  if (pathname === "/auth") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};