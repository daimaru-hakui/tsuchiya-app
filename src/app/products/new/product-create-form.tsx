"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const formSchema = z.object({
  productNumber: z.string().max(100, {
    message: "100文字以内で入力してください"
  }),
  productName: z.string().min(0, {
    message: "入力してください。"
  }),
  skus: z.array(z.object({
    size: z.string({ required_error: "入力してください。" }).min(0, { message: "0文字以上" }),
    price: z.number({ required_error: "入力してください。" }),
    stock: z.number({ required_error: "入力してください。" })
  }))
});

export default function ProductCreateForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control: form.control,
    name: "skus",
  });

  const addMemo = () => {
    append({
      size: "",
      price: 0,
      stock: 0
    });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await createProduct(data);
  };

  const createProduct = async (data: z.infer<typeof formSchema>) => {
    try {
      const colRef = doc(collection(db, "products"));
      setDoc(colRef, {
        productNumber: data.productNumber,
        productName: data.productName,
      });
      data.skus.forEach(async (sku, idx) => {
        const docRef = doc(collection(db, 'products', colRef.id, 'skus'));
        await setDoc(docRef, {
          id: docRef.id,
          size: sku.size,
          price: sku.price,
          stock: sku.stock,
          parentId: colRef.id,
          parentRef: colRef,
          order: idx + 1
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>商品登録</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <FormField
              control={form.control}
              defaultValue=""
              name="productNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>品番</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              defaultValue=""
              rules={{ required: true }}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品名</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {fields.map((field, index) => (
              <FormItem key={field.id}>
                <div className="flex gap-3">
                  <div>
                    {index === 0 && (<FormLabel>サイズ</FormLabel>)}
                    <Input placeholder="size"
                      {...form.register(`skus.${index}.size`, { required: true })}
                    />
                  </div>
                  <div>
                    {index === 0 && (<FormLabel>価格</FormLabel>)}
                    <Input type="number" placeholder="price"
                      {...form.register(`skus.${index}.price`, { required: true, valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    {index === 0 && (<FormLabel>在庫</FormLabel>)}
                    <Input type="number" placeholder="在庫"
                      {...form.register(`skus.${index}.stock`, { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            ))}
            <div className="text-center">
              <Button key="addButton" type="button" onClick={addMemo}>追加</Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">登録</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
