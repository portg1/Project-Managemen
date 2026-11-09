import { useDraggable } from "@dnd-kit/react";
import { CalendarDays, GripVertical, Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { updateTaskStatus } from "@/services/tasks/taskCrudService.js";

const labels = { todo: "To Do", in_progress: "In Progress", done: "Done" };
const format = (d) =>
	d
		? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
				new Date(`${d}T12:00:00`),
			)
		: "Not set";

export default function TaskCard({ task, project, assignee, onEdit }) {
	const { isDragging, ref, handleRef } = useDraggable({
		id: task.id,
		data: { taskId: task.id, status: task.status },
	});
	const overdue =
		task.dueDate &&
		task.dueDate < new Date().toISOString().slice(0, 10) &&
		task.status !== "done";
	return (
		<Card
			ref={ref}
			className={`transition-[opacity,box-shadow,transform] duration-200 ${isDragging ? "scale-[1.02] opacity-50 shadow-lg" : ""} ${overdue ? "border-destructive/60" : ""} ${task.status === "done" ? "bg-muted/50" : ""}`}
		>
			<CardHeader className="flex-row items-start justify-between gap-2">
				<div className="flex min-w-0 items-start gap-2">
					<button
						ref={handleRef}
						type="button"
						className="mt-0.5 cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing"
						aria-label={`Drag ${task.title}`}
					>
						<GripVertical className="size-4" />
					</button>
					<div className="min-w-0">
						<CardTitle
							className={`text-base ${task.status === "done" ? "line-through" : ""}`}
						>
							{task.title}
						</CardTitle>
						<p className="mt-1 text-sm text-muted-foreground">
							{project?.name || "Unknown project"}
						</p>
					</div>
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
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant={task.priority}>{task.priority}</Badge>
					<Select
						value={task.status}
						onValueChange={(status) => updateTaskStatus(task.id, status)}
					>
						<SelectTrigger
							className="h-7 w-auto min-w-28"
							aria-label={`Status for ${task.title}`}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(labels).map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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
