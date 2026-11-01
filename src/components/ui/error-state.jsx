import { CircleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "cn"

function ErrorState({ title = "Something went wrong", description = "Please try again.", onRetry, retryLabel = "Try again", className }) {
  return <div role="alert" className={cn("flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center", className)}><CircleAlertIcon aria-hidden="true" className="size-8 text-destructive" /><h2 className="text-lg font-medium">{title}</h2><p className="text-sm text-muted-foreground">{description}</p>{onRetry && <Button variant="danger" onClick={onRetry}>{retryLabel}</Button>}</div>
}

export { ErrorState }
