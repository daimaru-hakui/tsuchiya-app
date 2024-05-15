"use client";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OrderFormItem from "./order-form-item";
import { db } from "@/lib/firebase/client";
import {
  collectionGroup,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { CreateOrder, CreateOrderSchema, Product, Sku } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Loading from "@/app/loading";
import { useOrder } from "@/hooks/useOrder";
import * as actions from "@/actions";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface Props {
  products: Product[];
  skus: Sku[];
}

export default function OrderCreateForm({ products, skus }: Props) {
  const [items, setItems] = useState<(Sku & Product)[][]>([]);
  const [gender, setGender] = useState("man");
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateOrder>({
    resolver: zodResolver(CreateOrderSchema),
  });

  const onSubmit = (data: CreateOrder) => {
    const result = confirm("登録して宜しいでしょうか");
    if (!result) return;
    startTransition(async () => {
      const result = await actions.createOrder(data);
      if (result.status === "success") {
        toast({
          title: result.message,
          variant: "success",
          description: format(new Date(), "PPpp"),
        });
      } else if (result.status === "error") {
        toast({
          title: result?.message,
          variant: "destructive",
          description: format(new Date(), "PPpp"),
        });
      }
    });
  };

  const isCompanyName = form.watch("companyName", true);

  useEffect(() => {
    const getItems = async () => {
      try {
        const filterProducts = products.filter(
          (product) => product.gender === "other" || product.gender === gender
        );
        const filterSkus = filterProducts.map((product) => {
          const parentSkus = skus.filter((sku) => sku.parentId === product.id);
          return parentSkus.map((sku) => ({ ...product, ...sku }));
        });
        setItems(filterSkus);
      } catch (e: any) {
        console.log(e.message);
      } 
    };
    getItems();
  }, [gender, products, skus]);

  const getAddress = async () => {
    const zipCode = form.getValues("zipCode");
    const url = "https://zipcloud.ibsnet.co.jp/api/search";
    const res = await fetch(`${url}?zipcode=${zipCode}`);
    if (!res.ok) {
      throw Error("取得に失敗しました");
    }
    const { results } = await res.json();
    return results;
  };

  const handleFetchAdress = async () => {
    const results = await getAddress();
    if (results) {
      const address =
        results[0]?.address1 + results[0]?.address2 + results[0]?.address3;
      form.setValue("address", address);
    } else {
      form.setValue("address", "");
    }
  };

  const genders = [
    {
      value: "man",
      title: "男性用",
    },
    {
      value: "woman",
      title: "女性用",
    },
  ];

  const handleGenderChange = (e: string) => {
    setGender(e);
    const data = form.getValues();
    form.reset();
    form.setValue("section", data.section);
    form.setValue("employeeCode", data.employeeCode);
    form.setValue("initial", data.initial);
    form.setValue("username", data.username);
    form.setValue("position", data.position);
    form.setValue("siteCode", data.siteCode);
    form.setValue("siteName", data.siteName);
    form.setValue("zipCode", data.zipCode);
    form.setValue("address", data.address);
    form.setValue("tel", data.tel);
    form.setValue("memo", data.memo);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="w-full md:w-[550px]">
          <CardHeader>
            <CardTitle>商品発注</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <RadioGroup
              onValueChange={handleGenderChange}
              defaultValue={gender}
              className="flex flex-col space-y-1"
            >
              <Label>性別</Label>
              <div className="flex space-x-2">
                {genders.map(({ value, title }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={value} />
                    <Label htmlFor={value}>{title}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            <FormField
              control={form.control}
              name="section"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>所属名</FormLabel>
                  <FormControl>
                    <Input placeholder="派遣社員" {...field} />
                  </FormControl>
                  <FormDescription>
                    所属名又は派遣社員・JV構成員・協力会社
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row gap-3">
              <FormField
                control={form.control}
                name="employeeCode"
                defaultValue=""
                render={({ field }) => (
                  <FormItem id="siteCode">
                    <FormLabel>社員コード</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="initial"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>イニシャル</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <FormField
                control={form.control}
                name="username"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>氏名</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>役職</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="companyName"
                defaultValue={true}
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-start">
                    <FormLabel>社名</FormLabel>
                    <div className="flex items-center gap-3">
                      <Switch
                        id="companyName"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="companyName">
                        {isCompanyName ? "マーク有" : " TSUCHUYAマークなし"}
                      </Label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <hr className="mt-3" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {items.map((skus, index: number) => (
                <OrderFormItem
                  key={index}
                  form={form}
                  index={index}
                  skus={skus}
                />
              ))}
            </div>
            <hr />
            <FormField
              control={form.control}
              name="siteCode"
              defaultValue=""
              render={({ field }) => (
                <FormItem id="siteCode">
                  <FormLabel>工事コード又は組織コード</FormLabel>
                  <FormControl>
                    <Input
                      style={{ WebkitAppearance: "none" }}
                      type="number"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="siteName"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>現場名、又は組織名</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end gap-3">
              <FormField
                control={form.control}
                name="zipCode"
                defaultValue=""
                render={({ field }) => (
                  <FormItem id="siteCode">
                    <FormLabel>
                      郵便番号
                      <span className="text-gray-500 text-xs">
                        ※ハイフン（ー）なしで入力してください
                      </span>
                    </FormLabel>
                    <div className="flex gap-3">
                      <FormControl>
                        <Input type="number" placeholder="" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        key="address"
                        onClick={handleFetchAdress}
                      >
                        検索
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>住所</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tel"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TEL</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      className="w-[200px]"
                      placeholder="TEL"
                      pattern="[\d\-]*"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicant"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>申請者</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memo"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              登録
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
