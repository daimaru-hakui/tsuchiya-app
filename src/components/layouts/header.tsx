"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { auth } from "@/lib/firebase/client";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { DarkMode } from "@/app/dark-mode";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { useSession } from "next-auth/react";
import DropDownMenu from "../header-doropdown-menu";
import HeaderDropdownMenu from "../header-doropdown-menu";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("ログイン中");
      } else {
        console.log(pathname, user);
        if (pathname !== "/auth/login" && pathname !== "/auth/signup") {
          await signOut();
          router.push("/auth/login");
        }
      }
    });
  }, [router, pathname]);

  return (
    <>
      {pathname !== "/auth/login" && (
        <div className="p-3 flex justify-between">
          <Button variant="ghost" asChild>
            <Link href="/">TSUCHIYA APP</Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button size="sm" asChild variant="ghost">
              <Link href="/orders/new">発注登録</Link>
            </Button>
            <Button size="sm" asChild variant="ghost">
              <Link href="/products/new">商品登録</Link>
            </Button>
            <DarkMode />
            <HeaderDropdownMenu />
          </div>
        </div>
      )}
    </>
  );
}
