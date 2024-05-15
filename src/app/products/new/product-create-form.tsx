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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreateProduct, CreateProductSchema } from "@/types";
import * as actions from "@/actions";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export default function ProductCreateForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateProduct>({
    resolver: zodResolver(CreateProductSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skus",
  });

  const addSize = () => {
    append({
      size: "",
      salePrice: 0,
      costPrice: 0,
      stock: 0,
    });
  };

  const removeSize = (idx: number) => {
    remove(idx);
  };

  const reset = () => {
    form.reset();
  };

  const onSubmit = async (data: CreateProduct) => {
    startTransition(async () => {
      const result = await actions.createProduct(data);
      if (result.status === "success") {
        toast({
          title: "登録しました",
          variant: "success",
          description: format(new Date(), "PPpp"),
        });

        reset();
        form.setValue("gender", data.gender, {
          shouldDirty: true,
        });
        remove();
      } else if (result.status === "error") {
        toast({
          title: result.message,
          variant: "destructive",
          description: format(new Date(), "PPpp"),
        });
      }
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
    <Card className="w-full md:w-[600px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <Input autoComplete="off" placeholder="品番" {...field} />
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
                    <Input autoComplete="off" placeholder="商品名" {...field} />
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
                    <Input autoComplete="off" placeholder="表示名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isInseam"
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
              name="isMark"
              defaultValue={true}
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
                <div className="flex items-end gap-2 mt-3">
                  <div className="flex flex-col gap-2">
                    {index === 0 && <FormLabel>サイズ</FormLabel>}
                    <Input
                      autoComplete="off"
                      placeholder="size"
                      {...form.register(`skus.${index}.size`, {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    {index === 0 && <FormLabel>販売価格</FormLabel>}
                    <Input
                      type="number"
                      placeholder="販売価格"
                      {...form.register(`skus.${index}.salePrice`, {
                        required: true,
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    {index === 0 && <FormLabel>仕入価格</FormLabel>}
                    <Input
                      type="number"
                      placeholder="仕入価格"
                      {...form.register(`skus.${index}.costPrice`, {
                        required: true,
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
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
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              登録
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
