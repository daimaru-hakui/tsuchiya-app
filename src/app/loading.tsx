import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center">
      <Loader2 className="mr-2 h-16 w-16 text-green-600 animate-spin" />
    </div>
  );
}