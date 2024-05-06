export default function OrdersLayout({ children }: {
  children: React.
  ReactNode;
}) {
  return (
    <div className="w-full flex items-center justify-center my-4">
      {children}
    </div>
  );
}