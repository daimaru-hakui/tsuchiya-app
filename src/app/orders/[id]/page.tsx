import OrderShow from "./order-show";

interface Props {
  params: {
    id: string;
  };
}

export default function OrderShowPage({ params }: Props) {
  const id = params.id;

  return (
    <OrderShow id={id} />
  );
}