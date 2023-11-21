// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import withAuth from "next-auth/middleware";
// import { Role } from "./app/types/user";

// Middleware allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers, or responding directly.
// middleware will run  before routes are matched
// This function can be marked `async` if using `await` inside
//export function middleware(request: NextRequest) {
// 2 ways of defining paths that middleware will run on
//1. Matcher config-> see below outside of this function
//eg when using matcher no need to use condition
// return NextResponse.redirect(new URL("/home", request.url));
//2. using conditions inside middleware and checking current url. No need to export matcher config object
//eg
//  if (request.nextUrl.pathname.startsWith("/about")) {
//    return NextResponse.rewrite(new URL("/about-2", request.url));//rewriter url
//can also redirect to some page
//  }
//use NextResponse to redirect, set cookies, headers etc
//eg
// Setting cookies on the response using the `ResponseCookies` API
//   const response = NextResponse.next();
//   response.cookies.set("vercel", "fast");
//   let cookie = request.cookies.get("nextjs"); //console.log(cookie); // => { name: 'vercel', value: 'fast', Path: '/test' }
//   request.cookies.delete("nextjs");
//   request.cookies.has("nextjs"); // => false
//   return response; //mus return a response
//   eg 2:
//   Setting Headers
//}

//==>There are two ways to define which paths Middleware will run on:
//1. Conditional statements //added inside middleware-> see above

//2. Using MATCHER(Custom matcher config)
//matcher allows you to filter Middleware to run on specific paths. i.e above middleware will only be called for matched paths

//You can match a single path(supply a string:  matcher: '/about/:path*',) or multiple paths with an array syntax:
//The matcher values need to be constants so they can be statically analyzed at build-time. Dynamic values such as variables will be ignored.
///matcher: '/about/:path', matches only /about/a and /about/b but not /about/a/c. Use modifiers like:
//matcher: /about/:path* matches /about/a , /about/b /about/a/b/c etc because * is zero or more. (other modifiers=> ? is zero or one and + one or more)
// export const config = {
//   matcher: ["/about/:path*", "/dashboard/:path*"],
// };

//You can use a Next.js Middleware with NextAuth.js to protect your site.
//ref: https://www.youtube.com/watch?v=9bI3ihPg5j0&list=LL&index=14
//https://next-auth.js.org/configuration/nextjs#advanced-usage

//1. The most simple usage is when you want to require authentication for your entire site.
//Just put only the line below in this whole middleware page
// export { default } from "next-auth/middleware"

//That's it! Your application is now secured.

//2. If you only want to secure certain pages, export a config object with a matcher:
// export { default } from "next-auth/middleware";

// export const config = { matcher: ["/dashboard/:path*"] };

//Now you will still be able to visit every page, but only /dashboard will require authentication.
//If a user is not logged in, the default behavior is to redirect them to the sign-in page.

//3. Advanced usage eg to check roles and redirect appropriately,
//wrap the middleware.
//The middleware function will only be invoked if the authorized callback returns true.
//eg
/** 
import { withAuth } from "next-auth/middleware";
*/

//must export a Matcher config too

//The middleware function will only be invoked if the authorized callback returns true.
// export default withAuth(
//   // `withAuth` augments your `Request` with the user's token.
//   function middleware(req) {
//     // console.log(req.nextauth.token);
//     //if starts with admin, check if token has admin roles else redirect to login using NextResponse.redirect()-see above in middleware
//     //console.log(req.nextUrl.pathname === "admin");
//     //return NextResponse.redirect(new URL("/home", req.url));
//   },
//   {
//     callbacks: {
//       //
//       //return value of below authorize callback means, return true = proceed, return false = not authorized
//       //authorized: ({ token }) => true, //or check if token exist !!token //you can attach roles + other dets to token using callbacks in [..NextAuth]
//       //or if(token) return true // If there is a token, the user is authenticated
//       //or if route startWith, in this case no need for exporting config option,
//       //
//       authorized: ({ req,token }) => {
//         //protected vendor & buyer routes req token
//         // if (token === null) {
//         //   return false;
//         // }
//         // //check vendor role
//         // if (req.nextUrl.pathname.startsWith("/vendor")) {
//         //   //is vendor but no vendor role in token
//         //   if (!(token.roles as Role[]).includes(Role.Vendor)) {
//         //     return false;
//         //   }
//         // }
//         // //check buyer role
//         // if (req.nextUrl.pathname.startsWith("/account")) {
//         //   //is buyer but no buyer role in token
//         //   if (!(token.roles as Role[]).includes(Role.Buyer)) {
//         //     return false;
//         //   }
//         // }

//         //NextResponse.redirect(new URL("/home", req.url));

//         return true;
//       },
//     },

//     // Matches the pages config in `[...nextauth]`
//     //add this as with. If only added in [...nextauth], error pages first go to default then to custom ones
//     //This will ensure the page doesn't first redirect to default pages
//     pages: {
//       signIn: "/",
//       error: "/",
//       signOut: "/",
//     },
//   }
// );

//must export matcher config if using withAuth
// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//export const config = { matcher: ["/vendor/dashboard/:path*", "/account"] };

export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/admin/dashboard/", "/admin/dashboard/:path*"],
};
