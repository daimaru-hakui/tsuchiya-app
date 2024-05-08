import React from "react";
import ProductShow from "./product-show";

interface Props {
  params: {
    id: string;
  };
}

export default function ProductShowPage({ params }: Props) {
  return (
    <div>
      <ProductShow id={params.id} />
    </div>
  );
}
