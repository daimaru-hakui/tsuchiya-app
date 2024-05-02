"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateOrder, Product, Sku } from "@/types";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<CreateOrder, any, undefined>;
  index: number;
  skus: (Sku & Product)[];
}

export default function OrderFormItem({ form, index, skus }: Props) {

  return (
    <div
      className={`base:col-span-1 ${index + (1 % 2) === 0 ? "md:col-span-7" : "md:col-span-5"
        }`}
    >
      <div className="text-xs font-bold">{skus[0]?.displayName}</div>
      <div className="flex gap-3">
        <FormField
          control={form.control}
          defaultValue={""}
          name={`products.${index}.id`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>サイズ</FormLabel>
              <FormControl>
                <select {...form.register(`products.${index}.id`)} defaultValue={field.value} className="border rounded-md py-2 px-2 w-[90px] h-10">
                  <option value="">-</option>
                  {skus.map(({ size, id }) => (
                    <option key={size} value={id} >{size}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          defaultValue={0}
          name={`products.${index}.quantity`}
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>数量</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="数量"
                  className="w-[80px]"
                  min={0}
                  {...field}
                  onChange={(event) => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {skus[0]?.isHem && (
          <FormField
            control={form.control}
            defaultValue={skus[0].isHem ? 0 : undefined}
            rules={{ required: true }}
            name={`products.${index}.hem`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>裾上げ</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="裾上げ"
                    className="w-[80px]"
                    min={0}
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
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
