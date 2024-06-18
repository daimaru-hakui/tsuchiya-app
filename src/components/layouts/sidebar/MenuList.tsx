"use client";
import React from "react";
import MenuItem from "./MenuItem";
import LogoutButton from "./LogoutButton";
import { DarkModToggle } from "./dark-mode-toggle";
import { useSession } from "next-auth/react";

interface Props {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MenuList({ setOpen }: Props) {
  const role = useSession().data?.user.role || "user";
  return (
    <>
      <ul className="py-2 grow" onClick={() => setOpen && setOpen(false)}>
        {role !== "user" && (
          <MenuItem href="/dashboard">ダッシュボード</MenuItem>
        )}
        <MenuItem href="/orders/new">発注登録</MenuItem>
        <MenuItem href="/orders">発注一覧</MenuItem>
        <MenuItem href="/shippings">出荷一覧</MenuItem>
        <MenuItem href="/products">商品一覧</MenuItem>
        {role !== "user" && <MenuItem href="/invoice">請求書</MenuItem>}
        {role === "admin" && <MenuItem href="/products/new">商品登録</MenuItem>}
        {role === "admin" && <MenuItem href="admin">権限管理</MenuItem>}
        {/* <MenuItem href="/charges/new">保管・ピッキング料登録</MenuItem> */}
        {/* <MenuItem href="/adjustments">在庫調整</MenuItem> */}
      </ul>
      <footer className="md:flex md:items-end md:grow-1">
        <div className="flex items-center w-full justify-around mt-6 px-4 md:px-0">
          <LogoutButton />
          <DarkModToggle />
        </div>
      </footer>
    </>
  );
}
