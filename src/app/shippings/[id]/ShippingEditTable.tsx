import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ShippingDetail, UpdateShipping } from "@/types/shipping.type";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<UpdateShipping, any, undefined>;
  shippingDetails: ShippingDetail[];
}

export default function ShippingEditTable({ form, shippingDetails }: Props) {
  const { register, watch, control } = form;
  const [defaultTotalValue, setDefaultTotalValue] = useState(0);

  useEffect(() => {
    setDefaultTotalValue(
      shippingDetails?.reduce(
        (sum, detail) => sum + detail.quantity * detail.salePrice,
        0
      )
    );
  }, [shippingDetails]);

  const totalAmount =
    form
      .watch("details")
      ?.reduce(
        (sum, detail) => sum + +detail.quantity * +detail.salePrice,
        0
      ) ?? defaultTotalValue;

  return (
    <Table className="min-w-[1000px]">
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[100px]">区分</TableHead>
          <TableHead className="min-w-[100px]">品番</TableHead>
          <TableHead className="min-w-[280px]">品名</TableHead>
          <TableHead className="text-center min-w-[100px]">サイズ</TableHead>
          <TableHead className="text-center min-w-[100px]">出荷数</TableHead>
          <TableHead className="min-w-[100px]">単価</TableHead>
          <TableHead className="min-w-[100px]">小計</TableHead>
          <TableHead className="text-center min-w-[100px]">股下</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shippingDetails?.map((detail, idx) => (
          <TableRow key={detail.id}>
            <TableCell className="p">{detail.isStock && "在庫"}</TableCell>
            <TableCell>
              {detail.productNumber}
              <input
                className="hidden"
                {...register(`details.${idx}.id`)}
                defaultValue={detail.id}
              />
              <input
                type="number"
                className="hidden"
                {...register(`details.${idx}.inseam`, {
                  valueAsNumber: true,
                })}
                defaultValue={Number(detail.inseam)}
              />
              <input
                type="number"
                className="hidden"
                {...register(`details.${idx}.quantity`, {
                  valueAsNumber: true,
                })}
                defaultValue={Number(detail.quantity)}
              />
            </TableCell>
            <TableCell>{detail.productName}</TableCell>
            <TableCell className="text-center">{detail.size}</TableCell>
            <TableCell className="text-right">{detail.quantity}</TableCell>
            <TableCell className="">
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
                (watch(`details.${idx}.quantity`) ?? detail.quantity) *
                (watch(`details.${idx}.salePrice`) ?? detail.salePrice)
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
          <TableCell className="w-full py-3" colSpan={6}>
            合計
          </TableCell>
          <TableCell className="font-bold text-right">
            {totalAmount.toLocaleString()}
          </TableCell>
          <TableCell colSpan={1}></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
