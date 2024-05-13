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
        {orderDetails?.map((detail, idx) => (
          <TableRow key={detail.id}>
            <TableCell>{detail.productNumber}</TableCell>
            <TableCell >{detail.productName}</TableCell>
            <TableCell className="text-center">{detail.size}</TableCell>
            <TableCell className="w-[120px]">
              <input
                className="hidden"
                {...form.register(`details.${idx}.id`)}
                defaultValue={detail.id}
              />
              <FormField
                control={form.control}
                name={`details.${idx}.remainingQuantity`}
                defaultValue={detail.orderQuantity || 0}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" max={detail.orderQuantity} placeholder="" {...field} onChange={(event) =>
                        field.onChange(+event.target.value)
                      } />
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