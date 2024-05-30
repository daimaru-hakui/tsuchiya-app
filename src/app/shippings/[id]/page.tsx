import ShippingShow from "./ShippingShow";

interface Props {
  params: {
    id: string;
  };
}
export default function ShippingPage({ params }: Props) {
  const id = params.id;
  return (
    <div className="w-full flex items-center justify-center py-4">
      <ShippingShow id={id} />
    </div>
  );
}