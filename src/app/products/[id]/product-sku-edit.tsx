"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as actions from "@/actions";
import { useToast } from "@/hooks/useToast";
import { Sku, UpdateSku, UpdateSkuSchema } from "@/types/product.type";

interface Props {
  sku: Sku;
}

export default function ProductSkuEdit({ sku }: Props) {
  const [open, setOpen] = useState(false);
  const [isloading, startTransaction] = useTransition();
  const toast = useToast();

  const form = useForm<UpdateSku>({
    resolver: zodResolver(UpdateSkuSchema),
  });

  const onSubmit = (data: UpdateSku) => {
    startTransaction(async () => {
      const result = await actions.updateSku(data, sku.productId, sku.id);
      toast(result, { setOpen });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="xs">編集</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[650px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="mb-6">編集</DialogTitle>
              <div className="">
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
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3 mt-6">
                <FormField
                  defaultValue={sku.salePrice || 0}
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
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  defaultValue={sku.costPrice || 0}
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
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  defaultValue={sku.stock || 0}
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
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  defaultValue={sku.orderQuantity || 0}
                  control={form.control}
                  name="orderQuantity"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel>受注数量</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          autoComplete="off"
                          {...field}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  defaultValue={sku.sortNum || 0}
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
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DialogHeader>
            <DialogFooter className="mt-6 sm:justify-end gap-1">
              <Button
                key="close"
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                閉じる
              </Button>
              <Button disabled={isloading} type="submit">
                {isloading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                更新
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
