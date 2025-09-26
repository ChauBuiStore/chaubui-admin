import { ROUTES } from "@/lib/constants";
import { isTokenValid } from "@/lib/utils/token.utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = [ROUTES.LOGIN, ROUTES.HOME];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthenticated = token && isTokenValid(token);

  if (!isAuthenticated) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }
  } else {
    if (pathname === ROUTES.LOGIN || pathname === ROUTES.HOME) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
