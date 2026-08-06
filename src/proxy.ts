import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/" && request.method === "POST") {
    return NextResponse.rewrite(new URL("/api/webhook/send_article", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: "/" };

