import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";
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

export interface Order {
  id: string;
  orderNumber: number;
  section: string;
  employeeCode: string;
  initial: string;
  username: string;
  companyName: boolean;
  position: string;
  siteCode: string;
  siteName: string;
  zipCode: string;
  address: string;
  tel: string;
  applicant: string;
  memo: string;
  uid: string;
  status: string;
  createdAt: any;
  updatedAt: any;
}

export interface OrderDetail {
  id: string;
  orderId: string;
  orderRef: DocumentReference;
  skuId: string;
  skuRef: DocumentReference;
  productNumber: string;
  productName: string;
  size: string;
  price: number;
  salePrice: number;
  costPrice: number;
  stock: number;
  orderQuantity: number;
  quantity: number;
  inseam?: number | null;
  sortNum: number;
  uid: string;
  createdAt: any;
  updatedAt: any;
}

export type Shipping = {
  id: string;
  trackingNumber: string;
  shippingNumber: number;
  orderNumber: number;
  orderId: string;
  orderRef: DocumentReference<DocumentData, DocumentData>;
  section: string;
  employeeCode: string;
  initial: string;
  username: string;
  companyName: boolean;
  position: string;
  siteCode: string;
  siteName: string;
  zipCode: string;
  address: string;
  tel: string;
  applicant: string;
  memo: string;
  status: string;
  courier: "seino" | "sagawa" | "fukuyama";
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export interface ShippingDetail {
  id: string;
  shippingId: string;
  shippingRef: DocumentReference<DocumentData, DocumentData>;
  orderDetailId: string;
  orderDetailRef: DocumentReference<DocumentData, DocumentData>;
  skuId: string;
  skuRef: DocumentReference<DocumentData, DocumentData>;
  productNumber: string;
  productName: string;
  size: string;
  price: number;
  salePrice: number;
  costPrice: number;
  quantity: number;
  inseam?: number | null;
  memo?: string;
  sortNum: number;
  createdAt: any;
  updatedAt: any;
}

export const CreateShippingShema = z.object({
  orderId: z.string(),
  orderNumber: z.number(),
  section: z.string(),
  employeeCode: z.string(),
  initial: z.string(),
  username: z.string(),
  companyName: z.boolean(),
  position: z.string(),
  details: z
    .object({
      id: z.string(),
      skuId: z.string(),
      quantity: z.number(),
      inseam: z.number().optional(),
      shippingQuantity: z.number(),
      salePrice: z.number(),
      // remainingQuantity: z.number(),
    })
    .array(),
  siteCode: z.string(),
  siteName: z.string(),
  zipCode: z.string(),
  address: z.string(),
  tel: z.string(),
  applicant: z.string(),
  memo: z.string().optional(),
  shippingDate: z.string(),
  shippingCharge: z.number(),
});

export type CreateShipping = z.infer<typeof CreateShippingShema>;

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
  employeeCode: z.string(),
  initial: z.string(),
  username: z.string(),
  companyName: z.boolean(),
  position: z.string(),
  skus: z
    .object({
      id: z.string(),
      quantity: z.number(),
      inseam: z.number().optional(),
    })
    .array(),
  siteCode: z.string(),
  siteName: z.string(),
  zipCode: z.string(),
  address: z.string(),
  tel: z.string(),
  applicant: z.string(),
  memo: z.string().optional(),
});

export type CreateOrder = z.infer<typeof CreateOrderSchema>;

export const CreateProductSchema = z.object({
  productNumber: z.string().min(1, { message: "入力してください。" }).max(100, {
    message: "100文字以内で入力してください",
  }),
  productName: z.string().min(1, {
    message: "入力してください。",
  }),
  displayName: z.string().min(1, { message: "入力してください。" }),
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
  }),
  displayName: z.string().min(1, { message: "入力してください。" }),
  isInseam: z.boolean(),
  isMark: z.boolean(),
  gender: z.enum(["other", "man", "woman"]),
});
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;

export const UpdateSkuSchema = z.object({
  size: z.string().min(1, { message: "入力してください。" }),
  salePrice: z.number(),
  costPrice: z.number(),
  stock: z.number(),
  orderQuantity: z.number(),
  sortNum: z.number(),
});
export type UpdateSku = z.infer<typeof UpdateSkuSchema>;
