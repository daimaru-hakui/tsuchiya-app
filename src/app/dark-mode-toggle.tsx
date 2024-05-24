"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function DarkModToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="ml-auto">
      <Moon className="cursor-pointer absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" onClick={() => setTheme("light")} />
      <Sun className="cursor-pointer h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" onClick={() => setTheme("dark")} />
    </div>
  );
}
