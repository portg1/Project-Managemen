import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import FilterDropdown from "@/components/tasks/FilterDropdown.jsx";
import TaskCard from "@/components/tasks/TaskCard.jsx";
import TaskFormDialog from "@/components/tasks/TaskFormDialog.jsx";
import TaskSearch from "@/components/tasks/TaskSearch.jsx";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { filterTasks } from "@/services/tasks/taskSearchService.js";
import { useProjectStore } from "@/store/projectStore.js";

const columns = [
	["todo", "To Do"],
	["in_progress", "In Progress"],
	["done", "Done"],
];
export default function TasksPage() {
	const tasks = useProjectStore((s) => s.tasks);
	const projects = useProjectStore((s) => s.projects);
	const members = useProjectStore((s) => s.members);
	const [search, setSearch] = useState("");
	const [searchedTasks, setSearchedTasks] = useState(tasks);
	const [filters, setFilters] = useState({
		status: "",
		priority: "",
		assigneeId: "",
		projectId: "",
	});
	const [dialog, setDialog] = useState({
		open: false,
		status: "todo",
		task: null,
	});
	const visible = useMemo(
		() => filterTasks(searchedTasks, filters),
		[searchedTasks, filters],
	);
	return (
		<section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1>Tasks</h1>
					<p className="text-muted-foreground">
						Manage work across all projects.
					</p>
				</div>
				<Button
					onClick={() => setDialog({ open: true, status: "todo", task: null })}
				>
					<Plus /> Add task
				</Button>
			</div>
			<div className="flex flex-col gap-3 md:flex-row">
				<TaskSearch
					tasks={tasks}
					value={search}
					onChange={setSearch}
					onResults={setSearchedTasks}
				/>
				<FilterDropdown
					filters={filters}
					onChange={setFilters}
					projects={projects}
					members={members}
				/>
			</div>
			<div className="grid gap-4 lg:grid-cols-3">
				{columns.map(([status, label]) => {
					const list = visible.filter((t) => t.status === status);
					return (
						<div
							key={status}
							className="flex min-h-48 flex-col gap-3 rounded-xl bg-muted/40 p-3"
						>
							<div className="flex items-center justify-between">
								<h2 className="text-lg">{label}</h2>
								<span className="text-sm text-muted-foreground">
									{list.length}
								</span>
							</div>
							<Button
								variant="outline"
								className="w-full"
								onClick={() => setDialog({ open: true, status, task: null })}
							>
								<Plus /> Add task
							</Button>
							{list.length ? (
								list.map((t) => (
									<TaskCard
										key={t.id}
										task={t}
										project={projects.find((p) => p.id === t.projectId)}
										assignee={members.find((m) => m.id === t.assigneeId)}
										onEdit={(task) =>
											setDialog({ open: true, task, status: task.status })
										}
									/>
								))
							) : (
								<EmptyState
									title="No matching tasks"
									description="Tasks in this column will appear here."
								/>
							)}
						</div>
					);
				})}
			</div>
			<TaskFormDialog
				open={dialog.open}
				onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
				task={dialog.task}
				status={dialog.status}
			/>
		</section>
	);
}
