import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export default function Status({ value }: { value: string; }) {

  switch (value) {
    case "pending":
      return (
        <Badge variant="secondary"
          className={cn("bg-yellow-500 text-white hover:bg-yellow-500")}>
          未処理
        </Badge>
      );
    case "canceled":
      return (
        <Badge variant="secondary"
          className={cn("bg-zinc-500 text-white hover:bg-zinc-500")}>
          キャンセル
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="secondary"
          className={cn("bg-blue-500 text-white hover:bg-blue-500")}>
          処理中
        </Badge>
      );
    case "openOrder":
      return (
        <Badge variant="secondary"
          className={cn("bg-purple-500 text-white hover:bg-purple-500")}>
          注文残
        </Badge>
      );
    case "finished":
      return (
        <Badge variant="secondary"
          className={cn("bg-green-500 text-white hover:bg-green-500")}>
          完了
        </Badge>
      );
  }
}