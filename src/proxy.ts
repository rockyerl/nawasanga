import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { UserSession } from "@/types";
import { checkRateLimit } from "@/lib/rate-limit";

const SESSION_COOKIE_NAME = "fuel_carbon_session";

function getAuthSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "sundawa-fuel-carbon-super-secret-jwt-key-32chars";
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "client-default";

  // Global API Rate Limiting (120 req/min for general API, 20 req/min for auth actions)
  if (pathname.startsWith("/api/")) {
    const isAuthRoute = pathname.includes("/auth/");
    const limit = isAuthRoute ? 20 : 120;
    const windowMs = 60 * 1000;

    const rateLimit = checkRateLimit(`${clientIp}:${isAuthRoute ? "auth" : "api"}`, {
      limit,
      windowMs,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          code: 429,
          status: "Too Many Requests",
          message: "Batas frekuensi permintaan terlampaui. Silakan tunggu sebentar.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.max(1, Math.ceil((rateLimit.reset - Date.now()) / 1000)).toString(),
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.reset.toString(),
          },
        }
      );
    }
  }

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
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. Public landing, health, and onboarding pages: always allow
  if (
    pathname === "/" ||
    pathname.startsWith("/kyc") ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/api/internal/geocode") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout")
  ) {
    return NextResponse.next();
  }

  // 3. REST API Protection: Internal endpoints guard
  if (pathname.startsWith("/api/internal/")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        {
          code: 401,
          status: "Unauthorized",
          message: "Autentikasi sesi diperlukan untuk mengakses API ini.",
        },
        { status: 401 }
      );
    }

    const isSuperAdmin = session?.roleCode === "SUPERADMIN";
    const hasInternalPermission = session?.permissions?.some((p) => p.startsWith("internal."));

    if (!isSuperAdmin && !hasInternalPermission) {
      return NextResponse.json(
        {
          code: 403,
          status: "Forbidden",
          message: "Hak akses tidak mencukupi untuk modul internal administrator.",
        },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  // 4. Admin Backoffice Route Protection (/admin, /admin/*, /internals, /internals/*)
  if (pathname.startsWith("/admin") || pathname.startsWith("/internals")) {
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

  // 5. Client Portal Route Protection (/dashboard, /assets, /drivers, /locations, /logs, /reports, /billing, /support)
  const CLIENT_PORTAL_ROUTES = [
    "/dashboard",
    "/assets",
    "/drivers",
    "/locations",
    "/logs",
    "/reports",
    "/billing",
    "/support",
  ];

  const isClientRoute = CLIENT_PORTAL_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isClientRoute) {
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
