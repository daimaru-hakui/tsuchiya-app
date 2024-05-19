import ShippingShow from "./shipping-show";

interface Props {
  params: {
    id: string;
  };
}
export default function ShippingPage({ params }: Props) {
  const id = params.id;
  return (
    <ShippingShow id={id} />
  );
}