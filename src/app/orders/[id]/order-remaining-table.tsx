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

export default function OrderRemainingTable({ orderDetails, form }: Props) {

  return (
    <Table className="min-w-[800px]">
      <TableHeader>
        <TableRow>
          <TableHead>品番</TableHead>
          <TableHead>品名</TableHead>
          <TableHead className="text-center w-[80px]">サイズ</TableHead>
          <TableHead className="text-center w-[100px]">残数量</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderDetails?.map((item, idx) => (
          <TableRow key={item.id}>
            <TableCell>{item.productNumber}</TableCell>
            <TableCell >{item.productName}</TableCell>
            <TableCell className="text-center">{item.size}</TableCell>
            <TableCell className="w-[120px]">
              <input
                className="hidden"
                {...form.register(`skus.${idx}.id`)}
                defaultValue={item.id}
              />
              <FormField
                control={form.control}
                name={`skus.${idx}.remainingQuantity`}
                defaultValue={item.orderQuantity || 0}
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}