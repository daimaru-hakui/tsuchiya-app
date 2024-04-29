"use client";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, Sku } from "@/types";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<FieldValues, any, undefined>;
  index: number;
  skus: (Sku & Product)[];
}

export default function OrderFormItem({ form, index, skus }: Props) {

  return (
    <div className={`base:col-span-1 ${index + 1 % 2 === 0 ? "md:col-span-7" : "md:col-span-5"}`}>
      <div className="text-xs font-bold">{skus[0]?.productName}</div>
      <div className="flex gap-3">
        <FormField
          control={form.control}
          defaultValue=""
          name={`product.${index}.size`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>サイズ</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="サイズ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>size</SelectLabel>
                      {skus.map(({ size, id }) => (
                        <SelectItem key={size} value={id}>{size}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          defaultValue={0}
          name={`product.${index}.quantity`}
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>数量</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="数量"
                  className="w-[80px]"
                  {...field}
                  onChange={event => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {skus[0].isHem && (
          <FormField
            control={form.control}
            defaultValue={skus[0].isHem ? 0 : ""}
            rules={{ required: true }}
            name={`product.${index}.hem`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>裾上げ</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="裾上げ"
                    className="w-[80px]"
                    {...field}
                    onChange={event => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}