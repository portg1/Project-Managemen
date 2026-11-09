import { CalendarDays, Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const labels = { todo: "To Do", in_progress: "In Progress", done: "Done" };
const format = (d) =>
	d
		? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
				new Date(`${d}T12:00:00`),
			)
		: "Not set";
export default function TaskCard({ task, project, assignee, onEdit }) {
	const overdue =
		task.dueDate &&
		task.dueDate < new Date().toISOString().slice(0, 10) &&
		task.status !== "done";
	return (
		<Card className={overdue ? "border-destructive/60" : ""}>
			<CardHeader className="flex-row items-start justify-between gap-2">
				<div>
					<CardTitle className="text-base">{task.title}</CardTitle>
					<p className="mt-1 text-sm text-muted-foreground">
						{project?.name || "Unknown project"}
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={() => onEdit(task)}
					aria-label={`Edit ${task.title}`}
				>
					<Pencil />
				</Button>
			</CardHeader>
			<CardContent className="grid gap-3">
				<div className="flex flex-wrap gap-2">
					<Badge variant={task.priority}>{task.priority}</Badge>
					<Badge variant={task.status}>{labels[task.status]}</Badge>
				</div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					{assignee ? (
						<>
							<Avatar className="size-6">
								<AvatarFallback>
									{assignee.avatar || assignee.name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							{assignee.name}
						</>
					) : (
						"Unassigned"
					)}
				</div>
				<div
					className={`flex items-center gap-1 text-sm ${overdue ? "font-medium text-destructive" : "text-muted-foreground"}`}
				>
					<CalendarDays className="size-4" />
					{overdue ? "Overdue · " : ""}
					{format(task.dueDate)}
				</div>
			</CardContent>
		</Card>
	);
}
