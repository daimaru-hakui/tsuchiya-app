"use server";

import { CreateCharge, CreateChargeSchema } from "@/types/charge.type";
import { z } from "zod";

export async function createCharge(data: CreateCharge): Promise<{
  status: string;
  message: string;
}> {
  const result = CreateChargeSchema.safeParse({
    shippingDate: data.shippingDate,
    skus: data.skus,
    memo: data.memo,
  });
  return {
    status: "success",
    message: "登録しました",
  };
}
