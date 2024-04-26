import Footer from "@/components/layouts/footer";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="grid place-items-center min-h-[calc(100vh-50px)]">
        {children}
      </div>
    </>
  );
};

export default layout;
