import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "fuel_carbon_session";

function getAuthSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "sundawa-fuel-carbon-super-secret-jwt-key-32chars";
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      const secretKey = getAuthSecretKey();
      await jwtVerify(token, secretKey);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. If accessing /auth or /login while authenticated -> go to /dashboard
  if (pathname === "/auth" || pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. Allow public landing routes: /, /kyc, /payment
  if (pathname === "/" || pathname.startsWith("/kyc") || pathname.startsWith("/payment")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.svg|.*\\.png).*)"],
};
