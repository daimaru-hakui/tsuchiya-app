"use client";
import React from "react";
import MenuItem from "./MenuItem";
import LogoutButton from "./LogoutButton";
import { DarkModToggle } from "./dark-mode-toggle";

interface Props {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MenuList({ setOpen }: Props) {
  return (
    <>
      <ul className="py-2 grow" onClick={() => setOpen && setOpen(false)}>
        <MenuItem href="/dashboard">ダッシュボード</MenuItem>
        <MenuItem href="/products">商品一覧</MenuItem>
        <MenuItem href="/products/new">商品登録</MenuItem>
        <MenuItem href="/orders">発注一覧</MenuItem>
        <MenuItem href="/orders/new">発注登録</MenuItem>
        <MenuItem href="/shippings">出荷一覧</MenuItem>
        <MenuItem href="/invoice">請求書</MenuItem>
        <MenuItem href="/adjustments">在庫調整</MenuItem>
      </ul>
      <footer className="md:flex md:items-end md:grow-1">
        <div className="flex items-center w-full justify-around">
          <LogoutButton />
          <DarkModToggle />
        </div>
      </footer>
    </>
  );
}
