"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { CreateChargeSchema, CreateCharge } from "@/types/charge.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { register } from "module";
import { Textarea } from "@/components/ui/textarea";
import Loading from "@/app/loading";

interface Sku {
  id: string;
  skuId: string;
  salePrice: number;
  sortNum: number;
  productName: string;
}

export default function ChargeCreateForm() {
  const [isPending, startTransition] = useTransition();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [skus, setSkus] = useState<Sku[]>();

  const form = useForm<CreateCharge>({
    resolver: zodResolver(CreateChargeSchema),
    defaultValues: {
      skus: [{ id: "", productName: "", quantity: 1, salePrice: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skus",
  });
  const onSubmit = (data: CreateCharge) => {
    const result = confirm("登録して宜しいでしょうか");
    if (!result) return;
    console.log(data);
  };

  const addProduct = () => {
    append({
      id: "",
      productName: "",
      quantity: 1,
      salePrice: 0,
    });
  };

  const removeProduct = (idx: number) => {
    remove(idx);
  };

  useEffect(() => {
    const coll = collection(db, "options", "delivery", "skus");
    const unsub = onSnapshot(coll, {
      next: (snapshot) => {
        setSkus(snapshot.docs.map((doc) => ({ ...doc.data() } as Sku)));
      },
      error: (e) => {
        console.error(e.message);
      },
    });
    return () => unsub();
  }, []);

  if (!skus) return <Loading />;

  return (
    <Card className="w-full md:w-[400px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle>保管料＋ピッキング料 登録</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="shippingDate"
              defaultValue={new Date()?.toString()}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>日付</FormLabel>
                  <Popover
                    open={calendarOpen}
                    onOpenChange={() => {
                      setCalendarOpen(!calendarOpen);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>{field.value}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        numberOfMonths={1}
                        selected={new Date(field.value)}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="w-full text-center">
                        <Button
                          size="xs"
                          variant="outline"
                          className="mb-2"
                          onClick={() => setCalendarOpen(!calendarOpen)}
                        >
                          閉じる
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-3 mt-3">
                <input
                  type="hidden"
                  {...form.register(`skus.${index}.salePrice`)}
                />
                <FormField
                  control={form.control}
                  defaultValue={""}
                  name={`skus.${index}.id`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      {index === 0 && <FormLabel>商品名</FormLabel>}
                      <FormControl>
                        <select
                          {...form.register(`skus.${index}.id`)}
                          defaultValue={field.value}
                          className="border rounded-md py-2 px-2 h-10"
                          onClick={() => {
                            const id = form.watch(`skus.${index}.id`);
                            const sku = skus?.find((sku) => sku.id === id);
                            form.setValue(
                              `skus.${index}.salePrice`,
                              sku?.salePrice || 0
                            );
                            form.setValue(
                              `skus.${index}.productName`,
                              sku?.productName || ""
                            );
                          }}
                        >
                          <option value="">-</option>
                          {skus?.map((sku) => (
                            <option key={sku.id} value={sku.id}>
                              {sku.productName}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  defaultValue={0}
                  name={`skus.${index}.quantity`}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      {index === 0 && <FormLabel>数量</FormLabel>}
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="数量"
                          className="w-[80px]"
                          min={0}
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
                  control={form.control}
                  defaultValue={0}
                  name={`skus.${index}.salePrice`}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      {index === 0 && <FormLabel>価格</FormLabel>}
                      <FormControl>
                        <Input
                          type="number"
                          className="w-[80px]"
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
                <Trash2
                  className="mb-2 cursor-pointer"
                  onClick={() => removeProduct(index)}
                />
              </div>
            ))}

            <div className="text-center">
              <Button
                size="xs"
                key="addButton"
                type="button"
                onClick={addProduct}
              >
                <Plus />
              </Button>
            </div>
            <FormField
              control={form.control}
              defaultValue=""
              name="memo"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem className="flex flex-col mt-3">
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
