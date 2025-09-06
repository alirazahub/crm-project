// components/ui/skeleton.jsx
import { cn } from "../../lib/util"

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}
