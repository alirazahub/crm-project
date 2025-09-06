"use client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// Transaction item component
export default function TransactionItem({ customer, amount, time, status }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-md border border-slate-700/30">
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-slate-700 text-cyan-500">
            {customer
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium text-slate-200">{customer}</div>
          <div className="text-xs text-slate-500">{time}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-green-400">
          ${amount.toFixed(2)}
        </div>
        <Badge
          variant="outline"
          className={`text-xs ${
            status === "completed"
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
          }`}
        >
          {status}
        </Badge>
      </div>
    </div>
  );
}
