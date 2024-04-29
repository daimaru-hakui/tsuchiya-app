"use client";
import React from "react";
import { Button } from "../ui/button";
import { auth } from "@/lib/firebase/client";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { DarkMode } from "@/app/dark-mode";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const handleSignOut = async () => {
    await auth.signOut();
    await signOut();
  };
  return (
    <>
      {pathname !== "/login" && (
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
            <Button size="xs" onClick={handleSignOut}>
              ログアウト
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
