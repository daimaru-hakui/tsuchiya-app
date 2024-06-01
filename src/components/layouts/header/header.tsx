"use client";
import React, { useEffect } from "react";
import { auth } from "@/lib/firebase/client";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function Header() {
  const pathname = usePathname();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("ログイン中");
      } else {
        if (pathname !== "/auth/login" && pathname !== "/auth/signup") {
          await signOut();
          router.push("/auth/login");
        }
      }
    });
  }, [router, pathname]);
  console.log("login");

  return (
    <>
      {pathname !== "/auth/login" && pathname !== "/auth/signup" && (
        <div className="h-4 md:h-14">
          <h1 className="p-4 text-lg hidden md:block">
            {session.data && session.data?.user.email + " 様"}
          </h1>
        </div>
      )}
    </>
  );
}
