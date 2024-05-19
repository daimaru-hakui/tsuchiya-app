import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export default function Status({ value }: { value: string; }) {

  switch (value) {
    case "pending":
      return (
        <Badge variant="secondary"
          className={cn("bg-yellow-400 text-white hover:bg-yellow-400")}>
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
          className={cn("bg-blue-400 text-white hover:bg-blue-400")}>
          処理中
        </Badge>
      );
    case "openOrder":
      return (
        <Badge variant="secondary"
          className={cn("bg-purple-400 text-white hover:bg-purple-400")}>
          注文残
        </Badge>
      );
    case "picking":
      return (
        <Badge variant="secondary"
          className={cn("bg-sky-400 text-white hover:bg-sky-400")}>
          出荷準備中
        </Badge>
      );
    case "finished":
      return (
        <Badge variant="secondary"
          className={cn("bg-green-400 text-white hover:bg-green-400")}>
          完了
        </Badge>
      );
  }
}