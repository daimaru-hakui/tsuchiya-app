import { auth } from "@/auth";
import { auth as firebaseAuth } from "@/lib/firebase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/dashboard");
  return <main className="flex flex-col items-center justify-between"></main>;
}
