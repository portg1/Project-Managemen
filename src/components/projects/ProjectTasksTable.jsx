import { CalendarDays, Pencil, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const STATUS_LABELS = {
	todo: "To Do",
	in_progress: "In Progress",
	done: "Done",
};

function formatDate(value) {
	if (!value) return "Not set";
	return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
		new Date(`${value}T12:00:00`),
	);
}

export default function ProjectTasksTable({
	projectName,
	tasks,
	members,
	onAdd,
	onEdit,
}) {
	const counts = {
		todo: tasks.filter((task) => task.status === "todo").length,
		in_progress: tasks.filter((task) => task.status === "in_progress").length,
		done: tasks.filter((task) => task.status === "done").length,
	};

	return (
		<div>
			<div className="mb-5 flex items-center justify-between gap-4">
				<div>
					<h2>Project tasks</h2>
					<p className="text-sm text-muted-foreground">
						Work currently assigned to this project.
					</p>
				</div>
				<Button type="button" onClick={onAdd}>
					<Plus aria-hidden="true" /> Add task
				</Button>
			</div>
			<div className="mb-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
				<span>{counts.todo} To Do</span>
				<span aria-hidden="true">·</span>
				<span>{counts.in_progress} In Progress</span>
				<span aria-hidden="true">·</span>
				<span>{counts.done} Done</span>
			</div>
			{tasks.length === 0 ? (
				<EmptyState
					title="No tasks yet"
					description="Tasks added to this project will appear here."
				/>
			) : (
				<div className="overflow-x-auto rounded-lg border">
					<Table className="min-w-[700px]">
						<TableCaption>Tasks for {projectName}</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>Title</TableHead>
								<TableHead>Assignee</TableHead>
								<TableHead>Priority</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Due date</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tasks.map((task) => {
								const assignee = members.find(
									(member) => member.id === task.assigneeId,
								);
								return (
									<TableRow key={task.id} className="opacity-70">
										<TableHead scope="row">{task.title}</TableHead>
										<TableCell className="text-muted-foreground">
											{assignee?.name || "Unassigned"}
										</TableCell>
										<TableCell>
											<Button
												variant="ghost"
												size="icon-sm"
												onClick={() => onEdit(task)}
												aria-label={`Edit ${task.title}`}
											>
												<Pencil />
											</Button>
										</TableCell>
										<TableCell>
											<Badge variant={task.priority}>{task.priority}</Badge>
										</TableCell>
										<TableCell>
											<Badge variant={task.status}>
												{STATUS_LABELS[task.status] || task.status}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground">
											<span className="flex items-center gap-1">
												<CalendarDays aria-hidden="true" className="size-4" />
												{formatDate(task.dueDate)}
											</span>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
