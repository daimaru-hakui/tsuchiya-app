import { NextPage } from "next";
import React from "react";
import SignUpForm from "./signup-form";


const SignUpPage: NextPage = async () => {
  return (
    <div className="flex justify-center items-center w-full max-w-[calc(400px)]">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;