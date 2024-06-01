"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import MenuList from "./MenuList";
import { Menu } from "lucide-react";

export default function DrawerMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Menu />
      </DrawerTrigger>
      <DrawerContent className="px-3">
        <DrawerHeader onClick={() => setOpen(false)}>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <MenuList setOpen={setOpen} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">閉じる</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
