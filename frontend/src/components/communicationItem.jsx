"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// Communication item component
export default function CommunicationItem({ sender, time, message, avatar, unread }) {
  return (
    <div
      className={`flex space-x-3 p-2 rounded-md ${
        unread ? "bg-slate-800/50 border border-slate-700/50" : ""
      }`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar} alt={sender} />
        <AvatarFallback className="bg-slate-700 text-cyan-500">
          {sender.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">{sender}</div>
          <div className="text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400">{message}</div>
      </div>
      {unread && (
        <span className="h-2 w-2 bg-blue-500 rounded-full mt-2"></span>
      )}
    </div>
  );
}
