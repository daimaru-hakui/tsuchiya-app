import { DocumentReference } from "firebase/firestore";
import { z } from "zod";

export interface Product {
  id: string;
  productNumber: string;
  productName: string;
  sortNum: number;
  isInseam: boolean;
  isMark: boolean;
  displayName: string;
  gender: "man" | "woman" | "other";
  createdAt: any;
  updatedAt: any;
}

export const CreateProductSchema = z.object({
  productNumber: z.string().min(1, { message: "入力してください。" }).max(100, {
    message: "100文字以内で入力してください",
  }),
  productName: z
    .string()
    .min(1, {
      message: "入力してください。",
    })
    .max(100),
  displayName: z.string().min(1, { message: "入力してください。" }).max(100),
  isInseam: z.boolean(),
  isMark: z.boolean(),
  gender: z.enum(["other", "man", "woman"]),
  skus: z.array(
    z.object({
      size: z.string({ required_error: "入力してください。" }),
      salePrice: z.number().min(0),
      costPrice: z.number().min(0),
      stock: z.number().min(0, { message: "入力してください" }),
    })
  ),
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z.object({
  productNumber: z.string().min(1, { message: "入力してください。" }).max(100, {
    message: "100文字以内で入力してください",
  }),
  productName: z.string().min(1, {
    message: "入力してください。",
  }).max(100),
  displayName: z.string().min(1, { message: "入力してください。" }).max(100),
  isInseam: z.boolean(),
  isMark: z.boolean(),
  gender: z.enum(["other", "man", "woman"]),
});
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;

export interface Sku {
  id: string;
  productNumber: string;
  productName: string;
  isInseam: boolean;
  isMark: boolean;
  displayName: string;
  gender: "man" | "woman" | "other";
  productId: string;
  productRef: DocumentReference;
  size: string;
  price: number;
  salePrice: number;
  costPrice: number;
  stock: number;
  orderQuantity: number;
  parentRef: any;
  sortNum: number;
  createdAt: Date;
  updatedAt: Date;
}

export const UpdateSkuSchema = z.object({
  size: z.string().min(1, { message: "入力してください。" }).max(100),
  salePrice: z.number(),
  costPrice: z.number(),
  stock: z.number(),
  orderQuantity: z.number(),
  sortNum: z.number(),
});
export type UpdateSku = z.infer<typeof UpdateSkuSchema>;
