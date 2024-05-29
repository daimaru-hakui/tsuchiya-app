import DrawerMenu from "./DrawerMenu";
import MenuList from "./MenuList";
import MenuTitle from "./MenuTitle";

export default function MainMenu() {
  return (
    <nav className="md:min-h-dvh md:overflow-auto bg-muted flex justify-between md:flex-col p-4 sticky top-0">
      <header className="flex items-center md:pb-4 md:border-b">
        <MenuTitle />
      </header>
      <div className="hidden md:flex md:flex-col md:justify-between grow">
        <MenuList />
      </div>
      <div className="md:hidden flex items-center">
        <DrawerMenu />
      </div>
    </nav>
  );
}
