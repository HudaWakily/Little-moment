import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

const protectedRoutes = ["/criar", "/create/story", "/create/album"];
const authRoutes = ["/login", "/register", "/forgot-password", "/auth/login", "/auth/register", "/auth/forgot-password"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);

  const applyCookies = (response: NextResponse) => {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie);
    });
  };

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname === "/criar" ? "/create/story" : pathname);
    const response = NextResponse.redirect(loginUrl);
    applyCookies(response);
    return response;
  }

  if (isAuthRoute && user) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    const response = NextResponse.redirect(homeUrl);
    applyCookies(response);
    return response;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
