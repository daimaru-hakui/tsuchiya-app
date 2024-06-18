import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminEditModal from "./admin-edit-modal";
import { AdminUser } from "@/types/admin.type";

export interface Props {
  users: AdminUser[];
}

export default function AdminList({ users }: Props) {
  return (
    <div>
      <Table className="w-[900px]">
        <TableCaption>Account list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Emailアドレス</TableHead>
            <TableHead>表示名</TableHead>
            <TableHead>権限</TableHead>
            <TableHead>編集</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid}>
              <TableCell className="font-medium">{user.uid}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.displayName || "no name"}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <AdminEditModal user={user} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
