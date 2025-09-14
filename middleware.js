import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  
  // Protect API routes that require authentication
  if (request.nextUrl.pathname.startsWith('/api/quiet-blocks')) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader && !token) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/quiet-blocks/:path*', '/dashboard/:path*']
};