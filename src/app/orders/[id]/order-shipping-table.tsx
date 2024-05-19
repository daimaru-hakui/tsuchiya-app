"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderDetail, CreateShipping } from "@/types";
import { DocumentReference } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  orderDetails: (OrderDetail & { stock: number; })[];
  form: UseFormReturn<CreateShipping, any, undefined>;
  getSkuStock: (skuRef: DocumentReference) => Promise<number>;
  page: number;
}

export default function OrderShippingTable({ orderDetails, form, getSkuStock, page }: Props) {

  const [orderDetailWithStocks, setOrderDetailWithStocks] = useState<(OrderDetail & { stock: number; })[]>();

  useEffect(() => {
    const getOrderDetail = async () => {
      let data = [];
      for (const detail of orderDetails) {
        const stock = await getSkuStock(detail.skuRef);
        data.push({ ...detail, stock } as OrderDetail & { stock: number; });
      }
      setOrderDetailWithStocks(data);
    };
    getOrderDetail();
  }, [orderDetails, getSkuStock]);

  return (
    <Table className="min-w-[1000px]">
      <TableHeader>
        <TableRow>
          <TableHead>品番</TableHead>
          <TableHead>品名</TableHead>
          <TableHead className="text-center w-[80px]">サイズ</TableHead>
          <TableHead className="text-center w-[100px]">受注数</TableHead>
          <TableHead className="text-center w-[100px]">未出荷数</TableHead>
          <TableHead className="text-center w-[100px]">在庫数</TableHead>
          <TableHead className="w-[100px] font-bold text-primary">出荷数</TableHead>
          <TableHead className="w-[100px]">単価</TableHead>
          <TableHead className="text-center w-[80px]">股下</TableHead>
          <TableHead>備考</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderDetailWithStocks?.map((detail, idx) => (
          <TableRow key={detail.id}>
            <TableCell>
              {detail.productNumber}
              <input
                className="hidden"
                {...form.register(`details.${idx}.id`)}
                defaultValue={detail.id}
              />
              <input
                className="hidden"
                {...form.register(`details.${idx}.skuId`)}
                defaultValue={detail.skuId}
              />
              <input
                type="number"
                className="hidden"
                {...form.register(`details.${idx}.quantity`, {
                  valueAsNumber: true,
                })}
                defaultValue={Number(detail.quantity)}
              />
              <input
                type="number"
                className="hidden"
                {...form.register(`details.${idx}.inseam`, {
                  valueAsNumber: true,
                })}
                defaultValue={Number(detail.inseam)}
              />
            </TableCell>
            <TableCell>{detail.productName}</TableCell>
            <TableCell className="text-center">{detail.size}</TableCell>
            <TableCell className="text-right">{detail.orderQuantity}</TableCell>
            <TableCell className="text-right">{detail.quantity}</TableCell>
            <TableCell className="text-right">{detail.stock}</TableCell>
            <TableCell className="w-[120px]">
              <FormField
                control={form.control}
                name={`details.${idx}.shippingQuantity`}
                defaultValue={Number(detail.quantity)}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={detail.quantity}
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                        disabled={detail.quantity === 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TableCell>
            <TableCell className="w-[120px]">
              <FormField
                control={form.control}
                name={`details.${idx}.salePrice`}
                defaultValue={Number(detail.salePrice)}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={detail.salePrice}
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                        disabled={detail.quantity === 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TableCell>
            <TableCell className="text-right">
              {detail?.inseam && `${detail.inseam}cm`}
            </TableCell>
            <TableCell className="text-right">{detail?.memo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
