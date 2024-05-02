"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminUser, UpdatedAdminUser, UpdatedAdminUserSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

interface Props {
  user: AdminUser;
}

export default function AdminEditModal({ user }: Props) {
  const form = useForm<UpdatedAdminUser>({
    resolver: zodResolver(UpdatedAdminUserSchema),
  });

  const onSubmit = (data: UpdatedAdminUser) => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="xs">編集</Button>
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>編集</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6 mt-6">
                <div>Email: {user.email}</div>
                <FormField
                  control={form.control}
                  name="displayName"
                  defaultValue={user.displayName}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>表示名</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  defaultValue={user.role}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>権限</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a fruit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>role</SelectLabel>
                              <SelectItem value="admin">Adimn</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  更新
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
