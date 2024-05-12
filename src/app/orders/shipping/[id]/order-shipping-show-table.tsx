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
import { OrderDetail } from "@/types";
import { FieldValues, UseFormReturn, useForm } from "react-hook-form";

interface Props {
  orderDetails: OrderDetail[];
  form: UseFormReturn<FieldValues, any, undefined>;
}

export default function OrderShippingShowTable({ orderDetails, form }: Props) {

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
        {orderDetails.map((item, idx) => (
          <TableRow key={item.id}>
            <TableCell>{item.productNumber}</TableCell>
            <TableCell >{item.productName}</TableCell>
            <TableCell className="text-center">{item.size}</TableCell>
            <TableCell className="text-right">{item.orderQuantity}</TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="w-[120px]">
              <input
                className="hidden"
                {...form.register(`skus.${idx}.id`)}
                defaultValue={item.id}
              />
              <FormField
                control={form.control}
                name={`skus.${idx}.quantity`}
                defaultValue={item.quantity}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" max={item.orderQuantity} placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TableCell>
            <TableCell className="text-right">{item?.memo}</TableCell>
            <TableCell className="text-right">{item?.inseam && `${item.inseam}cm`}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};