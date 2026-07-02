import { TrendingDown, TrendingUp } from "lucide-react";

export default function TrendPill({ positive = true, 
  // value
 }: { positive?: boolean;
  //  value: string
   }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
        positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
      ].join(" ")}
    >
      <span className={positive ? "text-green-600" : "text-red-600"}>{positive ? (
  <TrendingUp className="h-4 w-4 text-green-600" />
) : (
  <TrendingDown className="h-4 w-4 text-red-600" />
)}</span>
      {/* {value} */}
    </span>
  );
}
