import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Order, UpdateOrder } from "@/types/order.type";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  order: Order;
  form: UseFormReturn<UpdateOrder, any, undefined>;
}

export default function OrderEditHeader({ order, form }: Props) {
  const { control } = form;
  return (
    <div className="flex flex-col gap-3 p-1">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FormField
          control={control}
          name="section"
          defaultValue={order.section}
          render={({ field }) => (
            <FormItem>
              <FormLabel>所属名</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="employeeCode"
          defaultValue={order.employeeCode}
          render={({ field }) => (
            <FormItem>
              <FormLabel>社員コード</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between  gap-3">
        <FormField
          control={control}
          name="initial"
          defaultValue={order.initial}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>イニシャル</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="companyName"
          defaultValue={order.companyName}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>社名刺繍</FormLabel>
              <div className="">
                <FormControl>
                  <Switch
                    className="mt-2"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="username"
          defaultValue={order.username}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>氏名</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="position"
          defaultValue={order.position}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>役職</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FormField
          control={control}
          name="siteCode"
          defaultValue={order.siteCode}
          render={({ field }) => (
            <FormItem>
              <FormLabel>工事コード</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="siteName"
          defaultValue={order.siteCode}
          render={({ field }) => (
            <FormItem>
              <FormLabel>現場名</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="zipCode"
          defaultValue={order.zipCode}
          render={({ field }) => (
            <FormItem>
              <FormLabel>郵便番号</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="address"
          defaultValue={order.address}
          render={({ field }) => (
            <FormItem>
              <FormLabel>住所</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="tel"
          defaultValue={order.tel}
          render={({ field }) => (
            <FormItem>
              <FormLabel>TEL</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="applicant"
          defaultValue={order.tel}
          render={({ field }) => (
            <FormItem>
              <FormLabel>申請者</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="memo"
          defaultValue={order.memo}
          render={({ field }) => (
            <FormItem>
              <FormLabel>メモ</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
