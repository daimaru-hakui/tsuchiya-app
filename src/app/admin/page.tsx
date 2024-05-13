import { auth } from "@/auth";
import { auth as firebaseAuth } from "@/lib/firebase/server";
import AdminList from "./admin-list";
import { AdminUser } from "@/types";
import { redirect } from "next/navigation";
import paths from "@/paths";

export interface User {
  users: AdminUser;
}

export default async function AdminPage() {
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect(paths.home());
  }

  const admin = await firebaseAuth.listUsers(100);

  const users = admin.users.map((user) => {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      role: user.customClaims?.role as "admin" | "user" | "member",
    };
  });

  return (
    <div className="w-full flex justify-center">
      <AdminList users={users} />
    </div>
  );
}
