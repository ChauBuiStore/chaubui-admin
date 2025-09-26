import { ROUTES } from "@/lib/constants";
import { isTokenValid } from "@/lib/utils/token.utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  const isAuthenticated = token && isTokenValid(token);

  if (pathname === ROUTES.HOME) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    } else {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }
  }

  if (pathname.startsWith(ROUTES.DASHBOARD)) {
    if (!isAuthenticated) {
      const response = NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
      response.cookies.delete("auth_token");
      return response;
    }
    return NextResponse.next();
  }

  if (pathname === ROUTES.LOGIN && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
