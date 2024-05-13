"use client";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { OrderDetail, CreateShipping } from "@/types";
import { UseFormReturn } from "react-hook-form";

interface Props {
  orderDetails: OrderDetail[];
  form: UseFormReturn<CreateShipping, any, undefined>;
}

export default function OrderShippingTable({ orderDetails, form }: Props) {

  return (
    <Table className="min-w-[800px]">
      <TableHeader>
        <TableRow>
          <TableHead>品番</TableHead>
          <TableHead>品名</TableHead>
          <TableHead className="text-center w-[80px]">サイズ</TableHead>
          <TableHead className="text-center w-[100px]">受注数量</TableHead>
          <TableHead className="text-center w-[110px]">未出荷数量</TableHead>
          <TableHead className="w-[120px]">出荷数量</TableHead>
          <TableHead className="text-center w-[80px]">股下</TableHead>
          <TableHead >備考</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderDetails?.map((detail, idx) => (
          <TableRow key={detail.id}>
            <TableCell>{detail.productNumber}</TableCell>
            <TableCell >{detail.productName}</TableCell>
            <TableCell className="text-center">{detail.size}</TableCell>
            <TableCell className="text-right">{detail.orderQuantity}</TableCell>
            <TableCell className="text-right">{detail.quantity}</TableCell>
            <TableCell className="w-[120px]">
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
                {...form.register(`details.${idx}.quantity`, { valueAsNumber: true })}
                defaultValue={Number(detail.quantity)}
              />
              <FormField
                control={form.control}
                name={`details.${idx}.shippingQuantity`}
                defaultValue={Number(detail.quantity)}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" max={detail.quantity} placeholder="" {...field} onChange={(event) =>
                        field.onChange(+event.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TableCell>
            <TableCell className="text-right">{detail?.memo}</TableCell>
            <TableCell className="text-right">{detail?.inseam && `${detail.inseam}cm`}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};