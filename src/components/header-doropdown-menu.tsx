import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { auth } from "@/lib/firebase/client";
import { signOut } from "next-auth/react";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";

export default function HeaderDropdownMenu() {
  const session = useSession();

  const handleSignOut = async () => {
    await auth.signOut();
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="iconMini" asChild className="p-1">
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{session.data?.user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>ログアウト</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
