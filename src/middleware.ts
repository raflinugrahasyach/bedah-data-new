import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  const isAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isPenelitiRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/proyek") ||
    nextUrl.pathname.startsWith("/dataset") ||
    nextUrl.pathname.startsWith("/advisor") ||
    nextUrl.pathname.startsWith("/analisis") ||
    nextUrl.pathname.startsWith("/validasi") ||
    nextUrl.pathname.startsWith("/laporan") ||
    nextUrl.pathname.startsWith("/visualisasi") ||
    nextUrl.pathname.startsWith("/bantuan") ||
    nextUrl.pathname.startsWith("/pengaturan");

  // If already logged in and visiting login or landing page
  if (isLoggedIn && isAuthPage) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Admin route protection: strictly for ADMIN
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(nextUrl.pathname), nextUrl));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  // Peneliti route protection: researchers only (or admin redirected to /admin)
  if (isPenelitiRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(nextUrl.pathname), nextUrl));
    }
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|brand/|.*\\.png$).*)",
  ],
};

