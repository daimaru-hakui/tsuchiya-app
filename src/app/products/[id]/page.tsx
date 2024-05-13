import React from "react";
import ProductShow from "./product-show";
import {updateSku} from "@/actions/update-sku"

interface Props {
  params: {
    id: string;
  };
}

export default function ProductShowPage({ params }: Props) {
  return (
    <div className="w-full flex items-center justify-center py-4">
      <ProductShow id={params.id} updateSku={updateSku}/>
    </div>
  );
}
