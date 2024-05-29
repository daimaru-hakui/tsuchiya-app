import { DocumentReference, Timestamp } from "firebase/firestore";
import { z } from "zod";

export type Shipping = {
  id: string;
  trackingNumber: string;
  shippingNumber: number;
  shippingDate: string;
  orderNumber: number;
  orderId: string;
  orderRef: DocumentReference;
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
  shippingNumber: number;
  shippingRef: DocumentReference;
  orderDetailId: string;
  orderDetailRef: DocumentReference;
  skuId: string;
  skuRef: DocumentReference;
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
  isStock: boolean;
  createdAt: any;
  updatedAt: any;
}

export const CreateShippingShema = z.object({
  orderId: z.string(),
  orderNumber: z.number().max(100),
  section: z.string().max(100),
  employeeCode: z.string().max(100),
  initial: z.string().max(100),
  username: z.string().max(100),
  companyName: z.boolean(),
  position: z.string().max(100),
  details: z
    .object({
      id: z.string(),
      skuId: z.string(),
      quantity: z.number(),
      inseam: z.number().optional(),
      shippingStockQuantity: z.number(),
      shippingQuantity: z.number(),
      salePrice: z.number(),
    })
    .array(),
  siteCode: z.string().max(100),
  siteName: z.string().max(100),
  zipCode: z.string().max(100),
  address: z.string().max(100),
  tel: z.string().max(100),
  applicant: z.string().max(100),
  memo: z.string().max(1000).optional(),
  shippingDate: z.string(),
  shippingCharge: z.number(),
});
export type CreateShipping = z.infer<typeof CreateShippingShema>;

export const UpdateShippingSchema = z.object({
  shippingDate: z.any(),
  details: z
    .object({
      id: z.string(),
      quantity: z.number().min(0),
      inseam: z.number().optional(),
      salePrice: z.number().min(0),
    })
    .array(),
});
export type UpdateShipping = z.infer<typeof UpdateShippingSchema>;

export const DeleteShippingSchema = z.object({
  shippingId: z.string(),
  orderId: z.string(),
});
export type DeleteShipping = z.infer<typeof DeleteShippingSchema>;
