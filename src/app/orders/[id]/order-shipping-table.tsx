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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderDetail } from "@/types/order.type";
import { CreateShipping } from "@/types/shipping.type";
import { DocumentReference } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  orderDetails: (OrderDetail & { stock: number })[];
  form: UseFormReturn<CreateShipping, any, undefined>;
  getSkuStock: (skuRef: DocumentReference) => Promise<number>;
}

export default function OrderShippingTable({
  orderDetails,
  form,
  getSkuStock,
}: Props) {
  const [orderDetailWithStocks, setOrderDetailWithStocks] =
    useState<(OrderDetail & { stock: number })[]>();
  const { watch, register, control, getValues, setValue } = form;

  const totalAmount =
    watch("details")?.reduce(
      (sum, detail) => sum + detail.salePrice * detail.shippingQuantity,
      0
    ) || 0;

  useEffect(() => {
    const getOrderDetail = async () => {
      let data = [];
      for (const detail of orderDetails) {
        const stock = await getSkuStock(detail.skuRef);
        data.push({ ...detail, stock } as OrderDetail & { stock: number });
      }
      setOrderDetailWithStocks(data);
    };
    getOrderDetail();
  }, [orderDetails, getSkuStock]);

  const handleStockChange = () => {
    getValues().details.forEach((detail, idx) => {
      if (detail.shippingStockQuantity === 0) return;
      setValue(`details.${idx}.shippingQuantity`, detail.quantity);
      setValue(`details.${idx}.shippingStockQuantity`, 0);
    });
  };

  const handlePurchaseChange = () => {
    getValues().details.forEach((detail, idx) => {
      if (detail.shippingQuantity === 0) return;
      setValue(`details.${idx}.shippingStockQuantity`, detail.quantity);
      setValue(`details.${idx}.shippingQuantity`, 0);
    });
  };

  return (
    <Table className="min-w-[1300px]">
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[100px]">品番</TableHead>
          <TableHead className="min-w-[280px]">品名</TableHead>
          <TableHead className="text-center min-w-[100px]">サイズ</TableHead>
          <TableHead className="text-center min-w-[100px]">受注数</TableHead>
          <TableHead className="text-center min-w-[100px]">未出荷数</TableHead>
          <TableHead className="text-center min-w-[100px]">在庫数</TableHead>
          <TableHead
            className="min-w-[120px] font-bold text-primary text-center"
            onClick={handlePurchaseChange}
          >
            出荷数(在庫)
          </TableHead>
          <TableHead
            className="min-w-[120px] font-bold text-primary"
            onClick={handleStockChange}
          >
            出荷数(仕入)
          </TableHead>
          <TableHead className="min-w-[100px]">単価</TableHead>
          <TableHead className="min-w-[100px]">小計</TableHead>
          <TableHead className="text-center min-w-[100px]">股下</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderDetailWithStocks?.map((detail, idx) => (
          <TableRow key={detail.id}>
            <TableCell>
              {detail.productNumber}
              <input
                className="hidden"
                {...register(`details.${idx}.id`)}
                defaultValue={detail.id}
              />
              <input
                className="hidden"
                {...register(`details.${idx}.skuId`)}
                defaultValue={detail.skuId}
              />
              <input
                type="number"
                className="hidden"
                {...register(`details.${idx}.quantity`, {
                  valueAsNumber: true,
                })}
                defaultValue={Number(detail.quantity)}
              />
              <input
                type="number"
                className="hidden"
                {...register(`details.${idx}.inseam`, {
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
            <TableCell className="p-1">
              <FormField
                control={form.control}
                name={`details.${idx}.shippingStockQuantity`}
                defaultValue={Number(detail.quantity)}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={
                          detail.quantity -
                          (watch(`details.${idx}.shippingQuantity`) || 0)
                        }
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
            <TableCell className="px-1">
              <FormField
                control={control}
                name={`details.${idx}.shippingQuantity`}
                defaultValue={0}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={
                          detail.quantity -
                          (watch(`details.${idx}.shippingStockQuantity`) || 0)
                        }
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
            <TableCell className="px-1">
              <FormField
                control={control}
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
              {(
                watch(`details.${idx}.shippingQuantity`) *
                  watch(`details.${idx}.salePrice`) || 0
              ).toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {detail?.inseam && `${detail.inseam}cm`}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow className="my-2">
          <TableCell className="w-full py-3" colSpan={9}>
            合計
          </TableCell>
          <TableCell className="text-right">
            {totalAmount.toLocaleString()}
          </TableCell>
          <TableCell colSpan={2}></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
