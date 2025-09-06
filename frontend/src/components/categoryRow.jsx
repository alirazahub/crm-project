"use client";
import { Badge } from "@/components/ui/badge";
export default function CategoryRow({
  category,
  products,
  sales,
  revenue,
  growth,
}) {
  return (
    <div className="grid grid-cols-12 items-center text-xs text-slate-300 px-3 py-3 hover:bg-slate-800/30">
      <div className="col-span-4 flex items-center">
        <div className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></div>
        {category}
      </div>
      <div className="col-span-2">{products}</div>
      <div className="col-span-2">{sales}</div>
      <div className="col-span-2 font-semibold text-green-400">{revenue}</div>
      <div className="col-span-2">
        <Badge
          variant="outline"
          className={`${
            growth > 10
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : growth > 5
              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
              : "bg-red-500/10 text-red-400 border-red-500/30"
          } text-xs`}
        >
          +{growth}%
        </Badge>
      </div>
    </div>
  );
}
