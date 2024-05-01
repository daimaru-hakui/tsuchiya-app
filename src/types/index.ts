import {z} from "zod"
export interface Product {
  id: string;
  productNumber: string;
  productName: string;
  order: number;
  isHem: boolean;
  displayName: string;
}

export interface Sku {
  id: string;
  parentId: string;
  size: string;
  price: number;
  stock: number;
  parentRef: any;
  order: number;
}

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

export type CreateOrder = z.infer<typeof CreateOrderSchema>
