import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] Processing request for path: ${pathname}`);

  // Check if the current path is /register or /loginUser
  if (pathname === "/" || pathname.startsWith("/register")) {
    // Get cookies set by js-cookie
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    console.log(
      `[Middleware] Access Token: ${accessToken ? "Present" : "Not Present"}`
    );
    console.log(
      `[Middleware] Refresh Token: ${refreshToken ? "Present" : "Not Present"}`
    );

    // If both tokens exist, redirect to dashboard
    if (accessToken && refreshToken) {
      console.log("[Middleware] Both tokens found, redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      console.log("[Middleware] Tokens missing, proceeding with request");
    }
  } else {
    console.log("[Middleware] Path not protected, proceeding with request");
  }

  // Continue with the request if no redirect is needed
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/", "/register/:path*"],
};
