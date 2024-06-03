"use server";
import { auth } from "@/auth";
import { auth as firebaseAuth } from "@/lib/firebase/server";
import {
  AdminUser,
  UpdatedAdminUser,
  UpdatedAdminUserSchema,
} from "@/types/admin.type";
import { validateWithZodSchema } from "@/utils/schemas";
import { revalidatePath } from "next/cache";

export async function updateRole(
  data: UpdatedAdminUser,
  user: AdminUser
): Promise<{ status: string; message: string }> {
  try {
    const result = validateWithZodSchema(UpdatedAdminUserSchema, data);

    const session = await auth();
    if (!session) {
      throw new Error("認証エラー");
    }

    if (session.user.email !== "mukai@daimaru-hakui.co.jp") {
      throw new Error("認証エラー");
    }

    const customClaims = {
      role: result.role,
    };

    await firebaseAuth.setCustomUserClaims(user.uid!, customClaims);
    await firebaseAuth.updateUser(user.uid, {
      displayName: result.displayName,
    });
    revalidatePath("/admin")
  } catch (e: unknown) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "登録が失敗しました",
    };
  }
  return {
    status: "success",
    message: "更新しました",
  };
}
