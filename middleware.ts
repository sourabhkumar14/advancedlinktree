// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/og-data(.*)", // public OG scraper
  // "/u/(.*)",        // add this if you have public /u/username pages
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect(); // ✅ correct for latest Clerk
  }
});

export const config = {
  matcher: [
    // Run middleware for all *pages*,
    // skip Next internals, static files, and your OG API route
    "/((?!_next|static|.*\\..*|api/og-data).*)",
  ],
};
