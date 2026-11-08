import { InboxIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "cn";

function EmptyState({
	title = "Nothing here yet",
	description,
	icon: Icon = InboxIcon,
	action,
	className,
}) {
	return (
		<Card className={cn("items-center text-center", className)}>
			<CardContent className="flex flex-col items-center gap-3 py-10">
				<Icon aria-hidden="true" className="size-10 text-muted-foreground" />
				<h2 className="text-lg font-medium">{title}</h2>
				{description && (
					<p className="max-w-sm text-sm text-muted-foreground">
						{description}
					</p>
				)}
				{action}
			</CardContent>
		</Card>
	);
}

export { EmptyState };
