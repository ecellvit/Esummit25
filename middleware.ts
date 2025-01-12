import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  console.log('Path ::', path);
  console.log('Token ::', token);

  if (token) {
    console.log('User ::', token.user);
  } else {
    console.log('No token found');
  }
}

export const config = {
  matcher: [
    '/',
    '/(.*)'        // (.*) matches all sub-paths
  ]
}