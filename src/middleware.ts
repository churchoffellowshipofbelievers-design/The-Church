import { NextResponse, type NextRequest } from 'next/server'

const publicRoutes = [
  '/',
  '/about',
  '/biblical-foundation',
  '/login',
  '/register',
  '/forgot-password',
  '/privacy',
  '/terms',
  '/verify-email',
  '/complete-profile',
  '/community-guidelines'
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (publicRoutes.includes(pathname) || pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // For now, allow all routes - authentication will be handled client-side
  // TODO: Implement proper server-side authentication check
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
