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
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  productNumber: z.string().min(1, { message: "入力してください。" }).max(100, {
    message: "100文字以内で入力してください",
  }),
  productName: z.string().min(1, {
    message: "入力してください。",
  }),
  displayName: z.string().min(1, { message: "入力してください。" }),
  isHem: z.boolean(),
  gender: z.enum(["other", "man", "woman"]),
  skus: z.array(
    z.object({
      size: z
        .string({ required_error: "入力してください。" })
        .min(0, { message: "0文字以上" }),
      price: z.number({ required_error: "入力してください。" }),
      stock: z.number({ required_error: "入力してください。" }),
    })
  ),
});

export default function ProductCreateForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skus",
  });

  const addSize = () => {
    append({
      size: "",
      price: 0,
      stock: 0,
    });
  };

  const removeSize = (idx: number) => {
    remove(idx);
  };

  const reset = () => {
    form.reset();
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    setLoading(true);
    await createProduct(data);
  };

  const createProduct = async (data: z.infer<typeof formSchema>) => {
    try {
      const batch = writeBatch(db);
      const colRef = doc(collection(db, "products"));
      batch.set(colRef, {
        productNumber: data.productNumber,
        productName: data.productName,
        displayName: data.displayName,
        isHem: data.isHem,
        gender: data.gender,
        sortNum: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      data.skus.forEach((sku, idx) => {
        const docRef = doc(collection(db, "products", colRef.id, "skus"));
        batch.set(docRef, {
          id: docRef.id,
          size: sku.size,
          price: sku.price,
          stock: sku.stock,
          parentId: colRef.id,
          parentRef: colRef,
          sortNum: idx + 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      reset();
      remove()
    }
  };

  const genders = [
    {
      value: "other",
      title: "男女兼用",
    },
    {
      value: "man",
      title: "男性用",
    },
    {
      value: "woman",
      title: "女性用",
    },
  ];

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
                    <Input placeholder="品番" {...field} />
                  </FormControl>
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
                    <Input placeholder="商品名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              defaultValue=""
              rules={{ required: true }}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>表示名</FormLabel>
                  <FormControl>
                    <Input placeholder="表示名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isHem"
              defaultValue={false}
              render={({ field }) => (
                <FormItem className="flex items-end flex-row gap-3">
                  <div className="">
                    <FormLabel className="text-base mt-2">裾上げ</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(e) => field.onChange(e.valueOf())}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>区分</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {genders.map(({ value, title }) => (
                        <FormItem
                          key={value}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={value} />
                          </FormControl>
                          <FormLabel className="font-normal">{title}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.map((field, index) => (
              <FormItem key={field.id}>
                <div className="flex items-end gap-3">
                  <div>
                    {index === 0 && <FormLabel>サイズ</FormLabel>}
                    <Input
                      placeholder="size"
                      {...form.register(`skus.${index}.size`, {
                        required: true,
                      })}
                    />
                  </div>
                  <div>
                    {index === 0 && <FormLabel>価格</FormLabel>}
                    <Input
                      type="number"
                      placeholder="price"
                      {...form.register(`skus.${index}.price`, {
                        required: true,
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div>
                    {index === 0 && <FormLabel>在庫</FormLabel>}
                    <Input
                      type="number"
                      placeholder="在庫"
                      {...form.register(`skus.${index}.stock`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <Trash2
                    size={40}
                    className="cursor-pointer"
                    onClick={() => removeSize(index)}
                  />
                </div>
                <FormMessage />
              </FormItem>
            ))}
            <div className="text-center">
              <Button size="xs" key="addButton" type="button" onClick={addSize}>
                <Plus />
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              登録
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
