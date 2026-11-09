import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import FilterDropdown from "@/components/tasks/FilterDropdown.jsx";
import TaskCard from "@/components/tasks/TaskCard.jsx";
import TaskFormDialog from "@/components/tasks/TaskFormDialog.jsx";
import TaskSearch from "@/components/tasks/TaskSearch.jsx";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { updateTaskStatus } from "@/services/tasks/taskCrudService.js";
import { filterTasks } from "@/services/tasks/taskSearchService.js";
import { useProjectStore } from "@/store/projectStore.js";

const columns = [
	["todo", "To Do"],
	["in_progress", "In Progress"],
	["done", "Done"],
];

function TaskColumn({ status, label, list, projects, members, onAdd, onEdit }) {
	const { isDropTarget, ref } = useDroppable({ id: status, data: { status } });
	return (
		<div
			ref={ref}
			className={`flex min-h-48 flex-col gap-3 rounded-xl bg-muted/40 p-3 transition-colors duration-200 ${isDropTarget ? "bg-primary/10 ring-2 ring-primary/50" : ""}`}
		>
			<div className="flex items-center justify-between">
				<h2 className="text-lg">{label}</h2>
				<span className="text-sm text-muted-foreground">{list.length}</span>
			</div>
			<Button
				variant="outline"
				className="w-full"
				onClick={() => onAdd(status)}
			>
				<Plus /> Add task
			</Button>
			{list.length ? (
				list.map((task) => (
					<TaskCard
						key={task.id}
						task={task}
						project={projects.find((p) => p.id === task.projectId)}
						assignee={members.find((m) => m.id === task.assigneeId)}
						onEdit={onEdit}
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
}

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
	const openAdd = (status) => setDialog({ open: true, status, task: null });
	const handleDragEnd = ({ canceled, operation }) => {
		if (canceled) return;
		const taskId = operation?.source?.id;
		const status = operation?.target?.id;
		if (
			typeof taskId !== "string" ||
			!columns.some(([value]) => value === status)
		)
			return;
		const task = useProjectStore
			.getState()
			.tasks.find((item) => item.id === taskId);
		if (!task || task.status === status) return;
		updateTaskStatus(taskId, status);
	};
	return (
		<section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1>Tasks</h1>
					<p className="text-muted-foreground">
						Manage work across all projects.
					</p>
				</div>
				<Button onClick={() => openAdd("todo")}>
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
			{visible.length === 0 ? (
				<EmptyState
					title="No tasks found"
					description="Try changing your search or filters, or add a new task."
				/>
			) : (
				<DragDropProvider onDragEnd={handleDragEnd}>
					<div className="grid gap-4 lg:grid-cols-3">
						{columns.map(([status, label]) => (
							<TaskColumn
								key={status}
								status={status}
								label={label}
								list={visible.filter((task) => task.status === status)}
								projects={projects}
								members={members}
								onAdd={openAdd}
								onEdit={(task) =>
									setDialog({ open: true, task, status: task.status })
								}
							/>
						))}
					</div>
				</DragDropProvider>
			)}
			<TaskFormDialog
				open={dialog.open}
				onOpenChange={(open) => setDialog((current) => ({ ...current, open }))}
				task={dialog.task}
				status={dialog.status}
			/>
		</section>
	);
}
