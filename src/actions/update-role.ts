"use server";
import { auth } from "@/auth";
import { auth as firebaseAuth } from "@/lib/firebase/server";
import paths from "@/paths";
import { AdminUser, UpdatedAdminUser, UpdatedAdminUserSchema } from "@/types";
import { redirect } from "next/navigation";

export async function updateRole(
  data: UpdatedAdminUser,
  user: AdminUser
): Promise<{ status: string, message: string; }> {
  const result = UpdatedAdminUserSchema.safeParse({
    displayName: data.displayName,
    role: data.role,
  });

  if (!result.success) {
    console.log(result.error.flatten().formErrors.join(','));
    return {
      status: "error",
      message: result.error.flatten().formErrors.join(',')
    };
  }

  const session = await auth();
  if (!session) {
    console.log("no session");
    return {
      status: "error",
      message: "認証エラー"
    };
  }

  if (session.user.email !== "mukai@daimaru-hakui.co.jp") {
    return {
      status: "error",
      message: "no admin"
    };
  }

  const customClaims = {
    role: result.data.role,
  };

  try {
    await firebaseAuth.setCustomUserClaims(user.uid!, customClaims);
    await firebaseAuth.updateUser(user.uid, {
      displayName: result.data.displayName,
    });
    return {
      status: "success",
      message: "更新しました"
    };
  } catch (e: any) {
    console.log(e);
    return {
      status: "error",
      message: e.message,
    };
  }

}
