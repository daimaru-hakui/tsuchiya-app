import { NextPage } from "next";
import React from "react";
import LoginForm from "./login-form";
import { auth } from "@/auth";


const LoginPage: NextPage = async () => {
  const session = await auth();
  return (
    <div className="flex justify-center items-center w-full max-w-[calc(400px)]">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
