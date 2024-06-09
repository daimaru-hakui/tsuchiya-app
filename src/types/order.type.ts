// import { DocumentReference } from "firebase-admin/firestore";
import { DocumentReference } from "firebase-admin/firestore";
import { DocumentReference as DocumentReferenceClient } from "firebase/firestore";
import { z } from "zod";

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
  orderNumber: number;
  orderRef: DocumentReferenceClient;
  skuId: string;
  skuRef: DocumentReferenceClient;
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

export const CreateOrderSchema = z.object({
  section: z.string(),
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

export const UpdateOrderSchema = z.object({
  orderId: z.string(),
  section: z.string(),
  employeeCode: z.string(),
  initial: z.string().optional(),
  username: z.string(),
  companyName: z.boolean(),
  position: z.string(),
  details: z
    .object({
      id: z.string(),
      quantity: z.number().min(0),
      orderQuantity: z.number().min(0),
      salePrice: z.number().min(0),
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
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;

export const UpdateOrderCancelSchema = z.object({
  orderId: z.string(),
  details: z
    .object({
      id: z.string(),
      quantity: z.number().min(0),
      orderQuantity: z.number().min(0),
      salePrice: z.number().min(0),
      inseam: z.number().optional(),
    })
    .array(),
});
export type UpdateOrderCancel = z.infer<typeof UpdateOrderCancelSchema>;
