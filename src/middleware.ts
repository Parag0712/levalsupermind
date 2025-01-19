import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/auth(.*)", "/portal(.*)", "/images(.*)", "/api/v1/video"], // Add the route here
  ignoredRoutes: ["/chatbot"], // Routes to ignore middleware completely
});

export const config = {
  matcher: [
    "/((?!.+\\.[a-z]+$|_next).*)", // Match all routes except those with file extensions (like .js, .css) and internal _next routes
    "/", // Home page route
    "/(api|trpc)(.*)", // Any API or trpc route
  ],
};
