import { useMemo, useState } from "react";
import ProjectTasksTable from "@/components/projects/ProjectTasksTable.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

const PROJECT_STATUS_LABELS = {
	planned: "Planned",
	active: "Active",
	on_hold: "On Hold",
	completed: "Completed",
};

function formatDate(value) {
	if (!value) return "Not set";
	return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
		new Date(`${value}T12:00:00`),
	);
}

export default function ProjectDetailsTabs({
	project,
	tasks,
	members,
	progress,
	onAddTask,
	onEditTask,
}) {
	const [activeTab, setActiveTab] = useState("tasks");
	const projectMembers = useMemo(
		() =>
			members.filter((member) =>
				tasks.some((task) => task.assigneeId === member.id),
			),
		[members, tasks],
	);
	const tabs = [
		["tasks", `Tasks (${tasks.length})`],
		["details", "Details"],
		["team", `Team (${projectMembers.length})`],
	];

	return (
		<Card>
			<div
				role="tablist"
				aria-label="Project sections"
				className="flex overflow-x-auto border-b px-4"
			>
				{tabs.map(([tab, label]) => (
					<button
						key={tab}
						type="button"
						role="tab"
						aria-selected={activeTab === tab}
						onClick={() => setActiveTab(tab)}
						className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
					>
						{label}
					</button>
				))}
			</div>
			{activeTab === "tasks" && (
				<CardContent className="p-4 sm:p-6">
					<ProjectTasksTable
						projectName={project.name}
						tasks={tasks}
						members={members}
						onAdd={onAddTask}
						onEdit={onEditTask}
					/>
				</CardContent>
			)}
			{activeTab === "details" && (
				<CardContent className="grid gap-6 p-4 sm:grid-cols-2 sm:p-6">
					<div>
						<p className="text-sm text-muted-foreground">Description</p>
						<p className="mt-1">
							{project.description || "No description provided."}
						</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Status</p>
						<Badge className="mt-2" variant={project.status}>
							{PROJECT_STATUS_LABELS[project.status] || project.status}
						</Badge>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Start date</p>
						<p className="mt-1 font-medium">{formatDate(project.startDate)}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Due date</p>
						<p className="mt-1 font-medium">{formatDate(project.dueDate)}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Progress</p>
						<p className="mt-1 font-medium">{progress}% complete</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Task total</p>
						<p className="mt-1 font-medium">{tasks.length}</p>
					</div>
				</CardContent>
			)}
			{activeTab === "team" && (
				<CardContent className="p-4 sm:p-6">
					{projectMembers.length === 0 ? (
						<EmptyState
							title="No team members yet"
							description="Team members will appear when they are assigned a project task."
						/>
					) : (
						<div className="grid gap-3 sm:grid-cols-2">
							{projectMembers.map((member) => (
								<div
									key={member.id}
									className="flex items-center gap-3 rounded-lg border p-3"
								>
									<Avatar>
										<AvatarFallback>
											{member.avatar || member.name.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-medium">{member.name}</p>
										<p className="text-sm text-muted-foreground">
											{member.jobTitle || "Team member"}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			)}
		</Card>
	);
}
