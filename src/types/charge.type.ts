import { z } from "zod";
export const CreateChargeSchema = z.object({
  skus: z
    .object({
      id: z.string().min(1,"選択してください"),
      productName: z.string(),
      quantity: z.number(),
      salePrice: z.number(),
    })
    .array(),
  memo: z.string().max(1000).optional(),
  shippingDate: z.string(),
});
export type CreateCharge = z.infer<typeof CreateChargeSchema>;
