import { cn } from "@/lib/utils";
import { Clock, CheckCircle2 } from "lucide-react";

interface StatusBadgeProps {
  status: "pending" | "answered";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const isPending = status === "pending";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
        isPending
          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
          : "bg-green-100 text-green-800 border-green-200",
        className
      )}
    >
      {isPending ? (
        <>
          <Clock className="w-3.5 h-3.5" />
          چاوەڕوان
        </>
      ) : (
        <>
          <CheckCircle2 className="w-3.5 h-3.5" />
          وەڵامدراوەتەوە
        </>
      )}
    </span>
  );
}
