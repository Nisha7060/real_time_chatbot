// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  if (request.nextUrl.pathname === '/api/socket') {
    return NextResponse.next(); // Allow socket.io to initialize
  }
  return NextResponse.next();
}
