import MenuItem from "./menu-item";
import MenuTitle from "./menu-title";
import { DarkModToggle } from "@/app/dark-mode-toggle";
import LogoutButton from "@/components/layouts/sidebar/logout-button";

export default function MainMenu() {
  return (
    <nav className="md:min-h-dvh md:overflow-auto bg-muted flex md:flex-col p-4 sticky top-0">
      <header className="flex items-center md:pb-4 md:border-b">
        <MenuTitle />
      </header>
      <ul className="py-2 grow hidden md:block">
        <MenuItem href="/dashboard" >
          ダッシュボード
        </MenuItem>
        <MenuItem href="/products" >
          商品一覧
        </MenuItem>
        <MenuItem href="/products/new" >
          商品登録
        </MenuItem>
        <MenuItem href="/orders" >
          発注一覧
        </MenuItem>
        <MenuItem href="/orders/new" >
          発注登録
        </MenuItem>
        <MenuItem href="/adjustments" >
          在庫調整
        </MenuItem>
      </ul>
      <footer className="flex items-center grow md:grow-0">
        <LogoutButton />
        <DarkModToggle />
      </footer>
    </nav>
  );
}