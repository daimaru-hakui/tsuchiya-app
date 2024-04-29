"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import OrderFormItem from "./order-form-item";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/client";
import { Unsubscribe, collection, collectionGroup, onSnapshot, orderBy, query } from "firebase/firestore";
import { Product, Sku } from "@/types";

export default function OrderCreateForm() {
  const [items, setItems] = useState<(Sku & Product)[][]>([]);
  const [loading, setLoading] = useState(true);
  const form = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    let unsubSkus: Unsubscribe, unsubProducts: Unsubscribe;
    const getItems = async () => {
      try {
        const productsRef = collection(db, 'products');
        let products: Product[] = [];
        const productsQuery = query(productsRef, orderBy("order", "asc"));
        unsubProducts = onSnapshot(productsQuery, (snapshot) => {
          products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        });
        const skusRef = collectionGroup(db, 'skus');
        unsubSkus = onSnapshot(skusRef, (snapshot) => {
          const skus = snapshot.docs.map((doc) => (
            { ...doc.data(), id: doc.id } as Sku))
            .sort((a, b) => a.order < b.order ? -1 : 1);
          const filterSkus = products.map((product) => {
            const parentSkus = skus.filter(sku => sku.parentId === product.id);
            return parentSkus.map(sku => ({ ...product, ...sku, }));
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

    return () => {
      unsubProducts();
      unsubSkus();
    };

  }, []);

  if (loading) {
    return (
      <div>...loading</div>
    );
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>所属名</FormLabel>
                  <FormControl>
                    <Input placeholder="派遣社員" {...field} />
                  </FormControl>
                  <FormDescription>所属名又は派遣社員・JV構成員・協力会社</FormDescription>
                  <FormMessage />
                </FormItem>)}
            />
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="employeeCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>社員コード</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>)}
              />
              <FormField
                control={form.control}
                name="initial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>イニシャル</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>)}
              />
            </div>
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>氏名</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>)}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>役職</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>)}
              />
            </div>
            <hr />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {items.map(((skus, index: number) => (
                <OrderFormItem key={index} form={form} index={index} skus={skus} />
              )))}
            </div>
            <hr />
            <FormField
              control={form.control}
              name="siteCode"
              render={({ field }) => (
                <FormItem id="siteCode">
                  <FormLabel>工事コード又は組織コード</FormLabel>
                  <FormControl>
                    <Input style={{ WebkitAppearance: "none" }} type="number" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>)}
            />
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>現場名、又は組織名</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>)}
            />
            <div className="flex items-end gap-3">
              <FormField
                control={form.control}
                name="postCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>郵便番号</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>)}
              />
              <Button>検索</Button>
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>住所</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>)}
            />
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TEL</FormLabel>
                  <FormControl>
                    <Input className="w-[200px]" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>)}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">登録</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};