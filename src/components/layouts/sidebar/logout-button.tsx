"use client";
import { auth } from "@/lib/firebase/client";
import { Button } from "../../ui/button";
import { useSession } from "next-auth/react";

export default function LogoutButton() {
  const session = useSession();

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <>
      {session.data && (
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      )}
    </>
  );
}