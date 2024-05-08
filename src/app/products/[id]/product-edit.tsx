"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { Sku } from "@/types";

interface Props {
  sku: Sku;
}

export default function ProductEdit({ sku }: Props) {
  const form = useForm();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="xs">詳細</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[650px]" onBlur={() => form.reset()}>
        <Form {...form}>
          <form>
            <DialogHeader>
              <DialogTitle>編集</DialogTitle>
              <DialogDescription>
                <div className="mt-6">
                  <FormField
                    defaultValue={sku.size}
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>サイズ</FormLabel>
                        <FormControl>
                          <Input
                            disabled={true}
                            className="w-[100px]"
                            autoComplete="off"
                            placeholder="size"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-3 mt-6">
                  <FormField
                    defaultValue={sku.salePrice}
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>売価</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    defaultValue={sku.costPrice}
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>原価</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>価格</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    defaultValue={sku.stock}
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>在庫</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    defaultValue={sku.sortNum}
                    control={form.control}
                    name="sortNum"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>順番</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  閉じる
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
