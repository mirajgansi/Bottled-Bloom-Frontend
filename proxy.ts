import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "./lib/cookie";

const publicRoutes = [
  "/login",
  "/forget-password",
  "/register",
  "/reset-password",
];

const adminRoutes = ["/admin"];
const userRoutes = ["/user"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getAuthToken();
  const user = token ? await getUserData() : null;
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Authenticated → role-based access
  if (token && user) {
    if (isAdminRoute && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (isUserRoute && user.role !== "user" && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Authenticated users should not see login/register
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/login",
    "/register",
    "/dashboard",
  ],
};
