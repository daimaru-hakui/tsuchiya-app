"use server";
import { auth } from "@/auth";
import { auth as firebaseAuth} from "@/lib/firebase/server";
import paths from "@/paths";
import { AdminUser, UpdatedAdminUser, UpdatedAdminUserSchema } from "@/types";
import { redirect } from "next/navigation";

export async function updateRole(
  data: UpdatedAdminUser,
  user: AdminUser
): Promise<{} | undefined> {
  const result = UpdatedAdminUserSchema.safeParse({
    displayName: data.displayName,
    role: data.role,
  });

  if (!result.success) {
    return {
      message: "error",
    };
  }

  const session = await auth();
  if (!session) {
    return {
      message: "no session",
    };
  }

  if(session.user.email !== "mukai@daimaru-hakui.co.jp") {
    return  {
        message:"no admin"
    }
  }

  const customClaims = {
    role: result.data.role,
  };

  try {
    await firebaseAuth.setCustomUserClaims(user.uid!, customClaims);
    await firebaseAuth.updateUser(user.uid,{
      displayName: result.data.displayName,
    });

  } catch (e: any) {
    console.log(e);
    return {
      message: e.message,
    };
  }

  redirect(paths.adminAll());
}
