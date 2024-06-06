import Footer from "@/components/layouts/footer";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="grid place-items-center h-[calc(100vh-200px)]">
        {children}
      </div>
    </>
  );
};

export default AuthLayout;
