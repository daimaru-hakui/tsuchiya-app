import { redirect } from "next/navigation";
import DashboardStats from "./DashboardStat";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const role = session?.user.role;
  console.log(role);
  if (role === "user") {
    redirect("/orders");
  }
  return (
    <>
      <h1 className="my-2">Dashboard</h1>
      <DashboardStats />
    </>
  );
}
