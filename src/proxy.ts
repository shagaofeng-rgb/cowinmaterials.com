import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/" && request.method === "POST") {
    return NextResponse.rewrite(new URL("/api/webhook/send_article", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", request.nextUrl.pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = { matcher: ["/", "/admin/:path*"] };
