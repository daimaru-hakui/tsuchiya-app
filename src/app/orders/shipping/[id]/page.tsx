import OrderShippingShow from "./order-shipping-show";

interface Props {
  params: {
    id: string;
  };
}

export default function OrderShippingPage({ params }: Props) {
  const id = params.id;

  return (
    <OrderShippingShow id={id} />
  );
}