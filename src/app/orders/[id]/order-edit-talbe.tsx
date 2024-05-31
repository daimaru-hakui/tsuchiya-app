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
import { Order, OrderDetail, UpdateOrder } from "@/types/order.type";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  order: Order;
  orderDetails: OrderDetail[];
  form: UseFormReturn<UpdateOrder, any, undefined>;
}

export default function OrderEditTable({ order, orderDetails, form }: Props) {
  const { register, watch, control } = form;

  //   const totalAmount =
  //   watch("details")?.reduce(
  //     (sum, detail) => sum + detail.salePrice * detail.shippingQuantity,
  //     0
  //   ) || 0;

  return (
    <Table className="min-w-[850px]">
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[100px]">品番</TableHead>
          <TableHead className="min-w-[250px]">品名</TableHead>
          <TableHead className="text-center min-w-[100px]">サイズ</TableHead>
          <TableHead className="min-w-[100px]">受注数</TableHead>
          <TableHead className="min-w-[100px]">未出荷数</TableHead>
          <TableHead className="min-w-[100px]">単価</TableHead>
          <TableHead className="min-w-[100px]">小計</TableHead>
          <TableHead className="text-center min-w-[100px]">股下</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderDetails?.map((detail, idx) => (
          <TableRow key={detail.id}>
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
            <TableCell className="text-right">
              <FormField
                control={control}
                name={`details.${idx}.orderQuantity`}
                defaultValue={Number(detail.orderQuantity)}
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
                        disabled={detail.quantity === 0 || order.status !=="pending"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TableCell>
            <TableCell className="text-right">{detail.quantity}</TableCell>
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
                (watch(`details.${idx}.orderQuantity`) ??
                  detail.orderQuantity) *
                (watch(`details.${idx}.salePrice`) ?? detail.salePrice)
              ).toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {detail?.inseam && (
                <FormField
                  control={control}
                  name={`details.${idx}.inseam`}
                  defaultValue={Number(detail.inseam)}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
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
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow className="my-2">
          <TableCell className="w-full py-3" colSpan={6}>
            合計
          </TableCell>
          <TableCell className="text-right">
            {/* {totalAmount.toLocaleString()} */}
          </TableCell>
          <TableCell colSpan={1}></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
