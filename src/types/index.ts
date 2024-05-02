import { Timestamp } from "firebase/firestore";
import { z } from "zod";
export interface Product {
  id: string;
  productNumber: string;
  productName: string;
  sortNum: number;
  isHem: boolean;
  displayName: string;
  gender:"man" | "woman" | "other",
  createdAt:any;
  updatedAt:any;
}

export interface Sku {
  id: string;
  parentId: string;
  size: string;
  price: number;
  stock: number;
  parentRef: any;
  sortNum: number;
  createdAt:Date;
  updatedAt:Date;
}

export interface AdminUser {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  role: "admin" | "user" | "member";
}

export const UpdatedAdminUserSchema = z.object({
  displayName: z.string(),
  role: z.enum(["admin", "user", "member"]),
});

export type UpdatedAdminUser = z.infer<typeof UpdatedAdminUserSchema>;

export const CreateOrderSchema = z.object({
  section: z.string().min(1, { message: "所属名を入力してください。" }),
  employeeCode: z
    .string()
    .min(1, { message: "社員コードを入力してください。" }),
  initial: z.string(),
  username: z.string(),
  position: z.string(),
  products: z
    .object({
      id: z.string(),
      quantity: z.number(),
      hem: z.number().optional(),
    })
    .array(),
  siteCode: z.string(),
  siteName: z.string(),
  zipCode: z.string(),
  address: z.string(),
  tel: z.string(),
});

export type CreateOrder = z.infer<typeof CreateOrderSchema>;
