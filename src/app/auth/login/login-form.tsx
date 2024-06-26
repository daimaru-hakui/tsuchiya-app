"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { signIn } from "next-auth/react";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "emailを入力してください。" })
    .min(1, { message: "1文字以上入力してください" })
    .max(100),
  password: z.string().min(1, { message: "パスワードを入力してください。" }),
});

export type FormSchema = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    await signInHandler(data);
  };

  const signInHandler = async (data: FormSchema) => {
    setLoading(true);
    const { email, password } = data;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      await signIn("credentials", { token, callbackUrl: "/" });
    } catch (error) {
      console.error(error);
      alert("ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const logout = async () => {
      await signOut(auth);
    };
    logout();
  }, []);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className={cn("")}>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-2">
                {loading && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
