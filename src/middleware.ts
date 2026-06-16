import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

// Publishable key passed explicitly — bypasses Edge Runtime env var baking issues.
// This key is intentionally public (NEXT_PUBLIC_) and safe to include in source.
const CLERK_PK = 'pk_test_YWNlLXBlbGljYW4tNTQuY2xlcmsuYWNjb3VudHMuZGV2JA'

export default clerkMiddleware(
  async (auth, request) => {
    if (isPublicRoute(request)) return NextResponse.next()

    try {
      const { userId } = await auth()
      if (!userId) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  },
  { publishableKey: CLERK_PK }
)

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
