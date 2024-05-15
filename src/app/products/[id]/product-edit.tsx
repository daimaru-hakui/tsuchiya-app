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
import { Product, UpdateProduct, UpdateProductSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import * as actions from "@/actions";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/useToast";

interface Props {
  product: Product;
}

export default function ProductEdit({ product }: Props) {
  const [open, setOpen] = useState(false);
  const [isloading, startTransaction] = useTransition();
  const toast = useToast();

  const form = useForm<UpdateProduct>({
    resolver: zodResolver(UpdateProductSchema),
  });

  const onSubmit = (data: UpdateProduct) => {
    startTransaction(async () => {
      const result = await actions.updateProduct(data, product.id);
      toast(result, { setOpen });
    });
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="xs">編集</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[650px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="text-left">
              <DialogTitle className="mb-6">編集</DialogTitle>
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  defaultValue={product.productNumber}
                  name="productNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>品番</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="品番"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  defaultValue={product.productName}
                  rules={{ required: true }}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>商品名</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="商品名"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  defaultValue={product.displayName || ""}
                  rules={{ required: true }}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>表示名</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="表示名"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isInseam"
                  defaultValue={product.isInseam || false}
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
                  name="isMark"
                  defaultValue={product.isMark || false}
                  render={({ field }) => (
                    <FormItem className="flex items-end flex-row gap-3">
                      <div className="">
                        <FormLabel className="text-base mt-2">刺繍</FormLabel>
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
                  defaultValue={product.gender}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>区分</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={product.gender}
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
                              <FormLabel className="font-normal">
                                {title}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
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
}
