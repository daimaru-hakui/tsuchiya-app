"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
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
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as actions from "@/actions";
import { Loader2 } from "lucide-react";

interface Props {
  user: AdminUser;
}

export default function AdminEditModal({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const form = useForm<UpdatedAdminUser>({
    resolver: zodResolver(UpdatedAdminUserSchema),
  });

  const onSubmit = (data: UpdatedAdminUser) => {
    startTransition(async () => {
      await actions.updateRole(data, user);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="xs">編集</Button>
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>編集</DialogTitle>
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
                        <Input autoComplete="off" placeholder="" {...field} />
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
                            <SelectValue placeholder="role" />
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
              </div>
            </DialogHeader>
            <DialogFooter className="mt-6 sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => form.reset()}
                >
                  閉じる
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                更新
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
