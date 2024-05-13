import React from "react";
import ProductShow from "./product-show";

interface Props {
  params: {
    id: string;
  };
}

export default async function ProductShowPage({ params }: Props) {
  
  return (
    <div className="w-full flex items-center justify-center py-4">
      <ProductShow id={params.id}  />
    </div>
  );
}
