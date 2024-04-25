import { decode } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("authjs.session-token")?.value;
  return decode({
    token,
    salt: 'authjs.session-token' as string,
    secret: process.env.AUTH_SECRET as string
  }).then(decoded => {
    if (decoded?.uid) {
      return null;
    }
    return NextResponse.redirect(req.url + 'login');
  }).catch(e => {
    console.log(e);
    return NextResponse.redirect(req.url + 'login');
  });
}

export const config = {
  matcher: ['/'],
};