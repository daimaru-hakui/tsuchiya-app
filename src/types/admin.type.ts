import { z } from "zod";

export interface AdminUser {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  role: "admin" | "user" | "member" | "observer";
}

export const UpdatedAdminUserSchema = z.object({
  displayName: z.string(),
  role: z.enum(["admin", "user", "member", "observer"]),
});

export type UpdatedAdminUser = z.infer<typeof UpdatedAdminUserSchema>;
