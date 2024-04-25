"use client";
import React, { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { signIn } from "next-auth/react";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().min(0).max(100),
  password: z.string()
});

export type FormSchema = z.infer<typeof formSchema>;

export default function LoginForm() {
  const form = useForm<FormSchema>({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(formSchema)
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    await signInHandler(data);
  };
  const signInHandler = async (data: FormSchema) => {
    const { email, password } = data;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      await signIn("credentials", { token, callbackUrl: '/' });
    } catch (error) {
      console.error(error);
      alert("ログインに失敗しました");
    }
  };

  return (
    <Form {...form} >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="text-center mt-2 text-2xl">Login</div>
        <div className="flex flex-col gap-6 mt-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <Button type="submit" className="w-full">Sign in</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
