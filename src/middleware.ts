import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  const token =
    process.env.NODE_ENV === "development"
      ? cookies().get("authjs.session-token")?.value
      : cookies().get("__Secure-authjs.session-token")?.value;

  const salt =
    process.env.NODE_ENV === "development"
      ? "authjs.session-token"
      : "__Secure-authjs.session-token";

  return decode({
    token,
    salt: salt as string,
    secret: process.env.AUTH_SECRET as string,
  })
    .then((decoded) => {
      if (decoded?.uid) {
        return null;
      }
      return NextResponse.redirect(req.nextUrl.origin + "/auth/login");
    })
    .catch((e) => {
      console.log(e);
      return NextResponse.redirect(req.nextUrl.origin + "/auth/login");
    });
}

export const config = {
  matcher: ["/", "/products/:path*", "/dashboard/:path*", "/orders/:path*","/admin/:path*","/api/products/:path*","/shippings/:path*","/adjustments/:path*"],
};
