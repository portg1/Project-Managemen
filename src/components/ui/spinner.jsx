import { Loader2Icon } from "lucide-react"
import { cn } from "cn"

function Spinner({ size = "md", label = "Loading", className, ...props }) {
  const sizes = { sm: "size-3", md: "size-4", lg: "size-6" }
  return <Loader2Icon role="status" aria-label={label || undefined} aria-hidden={label ? undefined : true} className={cn("animate-spin", sizes[size] || sizes.md, className)} {...props} />
}

export { Spinner }
