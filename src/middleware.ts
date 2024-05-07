import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import * as nextauth from "next-auth/react";
import {cookies} from "next/headers"

export default async function middleware(req: NextRequest) {
  const token = cookies().get("__Secure-authjs.session-token")?.value
  console.log(token)
  return decode({
    token,
    salt: "__Secure-authjs.session-token" as string,
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
  matcher: ["/", "/products/:path*", "/dashboard/:path*"],
};
