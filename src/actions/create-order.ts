"use server";
import { auth } from "@/auth";
import { CreateOrder, CreateOrderSchema } from "@/types";

export async function createOrder(data: CreateOrder): Promise<void> {
  const result = CreateOrderSchema.safeParse({
    section: data.section,
    employeeCode: data.employeeCode,
    initial: data.initial,
    username: data.username,
    position: data.position,
    products: data.products,
    siteCode: data.siteCode,
    siteName: data.siteName,
    zipCode: data.zipCode,
    address: data.address,
    tel: data.tel,
  });

  if(!result.success) {
    return
  }

  const session = await auth()

  if(!session) {
    return 
  }
  console.log(session)
  console.log(data);
}
