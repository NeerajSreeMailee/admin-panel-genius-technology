import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which routes should be protected
const protectedRoutes = [
  '/dashboard',
  '/dashboard/products',
  '/dashboard/orders',
  '/dashboard/customers',
  '/dashboard/categories',
  '/dashboard/quotations',
  '/dashboard/payments',
  '/dashboard/settings'
]

// Define public routes that should not be protected
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log("Middleware triggered", { pathname, method: request.method });
  
  // Skip middleware for public routes
  if (publicRoutes.includes(pathname)) {
    console.log("Skipping middleware for public route");
    return NextResponse.next()
  }
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  console.log("Route protection check", { isProtectedRoute, pathname });
  
  if (!isProtectedRoute) {
    console.log("Route is not protected, allowing access");
    return NextResponse.next()
  }
  
  // For protected routes, we'll allow the request to proceed
  // The client-side AdminProtected component will handle authentication checks
  console.log("Allowing access to protected route, client-side auth will handle checks");
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}