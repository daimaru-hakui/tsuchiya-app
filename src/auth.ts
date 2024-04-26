import { auth as firebaseAuth } from "./lib/firebase/server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
// Your own logic for dealing with plaintext password strings; be careful!

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {},
      authorize: async (credentials: any) => {
        let user = null;
        const idToken = credentials.token;
        const decoded = await firebaseAuth.verifyIdToken(idToken);
        user = {
          ...decoded,
          uid: decoded.uid,
        };
        if (!user) {
          throw new Error("User not found.");
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // session.user.emailVerified = token.emailVerified;
      session.user.uid = token.uid;
      return session;
    },
  },
});
