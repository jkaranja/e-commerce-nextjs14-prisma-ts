import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL("/home", request.url));
// }

import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { Role } from "@prisma/client";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  //The middleware function will only be invoked if the authorized callback returns true.
  function middleware(req: NextRequestWithAuth) {
    //console.log(req.nextauth.token);
    // console.log(request.nextUrl.pathname)
    const token = req.nextauth.token;

    //protected vendor, checkout, & buyer routes req token (token will be null if not signed in)
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    //check vendor role
    if (req.nextUrl.pathname.startsWith("/vendor")) {
      //signed in but no vendor role in token - (buyer don't have access to vendor routes)
      if (!token.roles!.includes(Role.VENDOR)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    //check buyer role
    if (
      req.nextUrl.pathname.startsWith("/account") ||
      req.nextUrl.pathname.startsWith("/checkout")
    ) {
      //signed but no buyer role in token - (vendor don't have access to buyer routes)
      //you can make vendor have both buyer and vendor roles so they can use same a/c to buy and sell
      if (!token.roles!.includes(Role.BUYER)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => true, //all logic moved to the middleware above//true-> middleware will alway be invoked (for matched routes only tho, see matcher)
    },
  }
);

// Applies next-auth only to matching routes - can be regex
export const config = {
  matcher: ["/account/:path*", "/vendor/:path*", "/checkout/:path*"],
};
