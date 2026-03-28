import { NextRequest, NextResponse } from "next/server";
import { ProxyConfig } from "next/server";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};
export const config: ProxyConfig = {
  matcher: ["/api/:path*"],
};
export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
