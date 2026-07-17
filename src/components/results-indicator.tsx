import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

type ResultIndicatorProps = {
  index: number
  confirmed: boolean
  success: boolean
}

export function ResultIndicator({
  index,
  confirmed,
  success,
}: ResultIndicatorProps) {
  const Icon = success ? Check : X

  if (!confirmed) {
    return null
  }

  return (
    <div
      className={cn(
        "absolute -top-1 inset-x-auto text-foreground-lighter pointer-events-none",
        success ? "text-foreground-lighter" : "text-red-500",
      )}
    >
      <Icon
        className="size-[50cqw] animate-in fade-in zoom-in fill-mode-both duration-500"
        style={{
          animationDelay: `${index * 500}ms`,
        }}
      />
    </div>
  )
}
