"use client";
import { startTransition, useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import OrderFormItem from "./order-form-item";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase/client";
import { Unsubscribe, collectionGroup, onSnapshot } from "firebase/firestore";
import { CreateOrder, CreateOrderSchema, Product, Sku } from "@/types";
import * as actions from "@/actions";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  products: Product[];
}

export default function OrderCreateForm({ products }: Props) {
  const [items, setItems] = useState<(Sku & Product)[][]>([]);
  const [loading, setLoading] = useState(true);
  const form = useForm<CreateOrder>({
    resolver: zodResolver(CreateOrderSchema),
  });

  const onSubmit = (data: CreateOrder) => {
    console.log(data);
    startTransition(async () => {
      await actions.createOrder(data);
    });
  };

  useEffect(() => {
    let unsub: Unsubscribe;
    const getItems = async () => {
      try {
        const skusRef = collectionGroup(db, "skus");
        unsub = onSnapshot(skusRef, (snapshot) => {
          const skus = snapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id } as Sku))
            .sort((a, b) => (a.order < b.order ? -1 : 1));
          const filterSkus = products.map((product) => {
            const parentSkus = skus.filter(
              (sku) => sku.parentId === product.id
            );
            return parentSkus.map((sku) => ({ ...product, ...sku }));
          });
          setItems(filterSkus);
        });
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    getItems();
    return () => unsub();
  }, [products]);

  const getAddress = async () => {
    const zipCode = form.getValues("zipCode");
    const url = "https://zipcloud.ibsnet.co.jp/api/search";
    const res = await fetch(`${url}?zipcode=${zipCode}`);
    if (!res.ok) {
      throw Error("取得に失敗");
    }
    const { results } = await res.json();
    if (results) {
      const address =
        results[0]?.address1 + results[0]?.address2 + results[0]?.address3;
      form.setValue("address", address);
    } else {
      form.setValue("address", "");
    }
  };

  if (loading) {
    return <div>...loading</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="w-full md:w-[550px]">
          <CardHeader>
            <CardTitle>商品発注</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="section"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>所属名</FormLabel>
                  <FormControl>
                    <Input placeholder="派遣社員" {...field} />
                  </FormControl>
                  <FormDescription>
                    所属名又は派遣社員・JV構成員・協力会社
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="employeeCode"
                defaultValue=""
                render={({ field }) => (
                  <FormItem id="siteCode">
                    <FormLabel>社員コード</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="initial"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>イニシャル</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="username"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>氏名</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>役職</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <hr />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {items.map((skus, index: number) => (
                <OrderFormItem
                  key={index}
                  form={form}
                  index={index}
                  skus={skus}
                />
              ))}
            </div>
            <hr />
            <FormField
              control={form.control}
              name="siteCode"
              defaultValue=""
              render={({ field }) => (
                <FormItem id="siteCode">
                  <FormLabel>工事コード又は組織コード</FormLabel>
                  <FormControl>
                    <Input
                      style={{ WebkitAppearance: "none" }}
                      type="number"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="siteName"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>現場名、又は組織名</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end gap-3">
              <FormField
                control={form.control}
                name="zipCode"
                defaultValue=""
                render={({ field }) => (
                  <FormItem id="siteCode">
                    <FormLabel>
                      郵便番号
                      <span className="text-gray-500 text-xs">
                        ※ハイフン（ー）なしで入力してください
                      </span>
                    </FormLabel>
                    <div className="flex gap-3">
                      <FormControl>
                        <Input type="number" placeholder="" {...field} />
                      </FormControl>
                      <Button onClick={getAddress}>検索</Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>住所</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tel"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TEL</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      className="w-[200px]"
                      placeholder="TEL"
                      pattern="[\d\-]*"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              登録
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
