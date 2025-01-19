import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/auth(.*)", "/portal(.*)", "/images(.*)"], // Public routes accessible without authentication
  ignoredRoutes: ["/chatbot"], // Routes to be ignored from authentication middleware
});

export const config = {
  matcher: [
    "/((?!.+\\.[a-z]+$|_next).*)", // Match all routes except those with file extensions (like .js, .css) and internal _next routes
    "/", // Home page route
    "/(api|trpc)(.*)", // Any API or trpc route
  ],
};
