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
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useForm } from "react-hook-form";

export default function ProductCreateForm() {
  const form = useForm();
  return (
    <Form {...form}>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>商品登録</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="..."
            render={(field) => (
              <FormItem>
                <FormLabel className="font-bold">品番</FormLabel>
                <FormControl>
                  <Input placeholder="品番" {...field} className="" />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="..."
            render={(field) => (
              <FormItem>
                <FormLabel className="font-bold">商品名</FormLabel>
                <FormControl>
                  <Input placeholder="商品名" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="..."
            render={(field) => (
              <FormItem>
                <FormLabel className="font-bold">商品名</FormLabel>
                <FormControl>
                  <Input placeholder="商品名" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="..."
              render={(field) => (
                <FormItem>
                  <FormLabel className="font-bold">販売価格</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="売価" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="..."
              render={(field) => (
                <FormItem>
                  <FormLabel className="font-bold">仕入価格</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="原価" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
              control={form.control}
              name="..."
              render={(field) => (
                <FormItem>
                  <FormLabel className="font-bold">初期在庫</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="原価" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          <FormField
            control={form.control}
            name="..."
            render={(field) => (
              <FormItem>
                <FormLabel className="font-bold">備考</FormLabel>
                <FormControl>
                  <Textarea placeholder="備考" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full">登録</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
