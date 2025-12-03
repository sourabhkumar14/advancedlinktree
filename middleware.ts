import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Add your username routes to public routes
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/og-data(.*)', // added on 03dec
  '/([^/]+)' // This matches any single segment path like /username
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

// export const config = {
  // matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    // '/(api|trpc)(.*)',
  // ],
// };

// added on 03dec

export const config = {
  matcher: [
    // Run middleware ONLY for pages, NOT for API routes
    "/((?!_next|api|trpc|.*\\.(.*)$).*)",
  ],
};
