import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { UserSession } from "@/types";

const SESSION_COOKIE_NAME = "fuel_carbon_session";

function getAuthSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "sundawa-fuel-carbon-super-secret-jwt-key-32chars";
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let session: UserSession | null = null;

  if (token) {
    try {
      const secretKey = getAuthSecretKey();
      const { payload } = await jwtVerify(token, secretKey);
      session = payload as unknown as UserSession;
    } catch {
      session = null;
    }
  }

  const isAuthenticated = !!session;

  // 1. Guest redirect: If already logged in, redirect away from /login and /auth
  if (pathname === "/auth" || pathname === "/login") {
    if (isAuthenticated) {
      if (session?.roleCode === "SUPERADMIN") {
        return NextResponse.redirect(new URL("/internals", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. Public landing and onboarding pages: always allow
  if (
    pathname === "/" ||
    pathname.startsWith("/kyc") ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout")
  ) {
    return NextResponse.next();
  }

  // 3. Admin Backoffice Route Protection (/internals and /internals/*)
  if (pathname.startsWith("/internals")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isSuperAdmin = session?.roleCode === "SUPERADMIN";
    const hasInternalPermission = session?.permissions?.some((p) => p.startsWith("internal."));

    if (!isSuperAdmin && !hasInternalPermission) {
      // Forbidden: redirect normal client user back to client dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // 4. Client Portal Route Protection (/dashboard and /dashboard/*)
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webp|.*\\.ico).*)",
  ],
};
