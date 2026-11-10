import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { Plus, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import FilterDropdown from "@/components/tasks/FilterDropdown.jsx";
import TaskCard from "@/components/tasks/TaskCard.jsx";
import TaskFormDialog from "@/components/tasks/TaskFormDialog.jsx";
import TaskSearch from "@/components/tasks/TaskSearch.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { updateTaskStatus } from "@/services/tasks/taskCrudService.js";
import {
	DEFAULT_TASK_FILTERS,
	DUE_DATE_FILTERS,
	filterAndSearchTasks,
	TASK_PRIORITIES,
	TASK_STATUSES,
} from "@/services/tasks/taskSearchService.js";
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
	const [params, setParams] = useSearchParams();
	const tasks = useProjectStore((s) => s.tasks);
	const projects = useProjectStore((s) => s.projects);
	const members = useProjectStore((s) => s.members);
	const search = params.get("q") || "";
	const filters = useMemo(() => {
		const rawFilters = Object.fromEntries(
			Object.keys(DEFAULT_TASK_FILTERS).map((key) => [
				key,
				params.get(key) || "",
			]),
		);
		return {
			...rawFilters,
			status: Object.hasOwn(TASK_STATUSES, rawFilters.status)
				? rawFilters.status
				: "",
			priority: Object.hasOwn(TASK_PRIORITIES, rawFilters.priority)
				? rawFilters.priority
				: "",
			dueDate: Object.hasOwn(DUE_DATE_FILTERS, rawFilters.dueDate)
				? rawFilters.dueDate
				: "",
			assigneeId:
				rawFilters.assigneeId === "unassigned" ||
				members.some((member) => member.id === rawFilters.assigneeId)
					? rawFilters.assigneeId
					: "",
			projectId: projects.some((project) => project.id === rawFilters.projectId)
				? rawFilters.projectId
				: "",
		};
	}, [members, params, projects]);
	const updateQuery = useCallback(
		(key, value) => {
			const next = new URLSearchParams(params);
			if (value) next.set(key, value);
			else next.delete(key);
			setParams(next, key === "q" ? { replace: true } : undefined);
		},
		[params, setParams],
	);
	const setSearch = useCallback(
		(value) => updateQuery("q", value.trim()),
		[updateQuery],
	);
	const setFilters = useCallback(
		(nextFilters) => {
			const next = new URLSearchParams(params);
			Object.keys(DEFAULT_TASK_FILTERS).forEach((key) => {
				if (nextFilters[key]) next.set(key, nextFilters[key]);
				else next.delete(key);
			});
			setParams(next);
		},
		[params, setParams],
	);
	const [dialog, setDialog] = useState({
		open: false,
		status: "todo",
		task: null,
	});
	const visible = useMemo(
		() => filterAndSearchTasks(tasks, search, filters),
		[tasks, search, filters],
	);
	const clearFilters = useCallback(() => {
		const next = new URLSearchParams(params);
		next.delete("q");
		Object.keys(DEFAULT_TASK_FILTERS).forEach((key) => {
			next.delete(key);
		});
		setParams(next);
	}, [params, setParams]);
	const chips = [
		...(search ? [{ key: "q", label: `Search: ${search}` }] : []),
		...Object.entries(filters)
			.filter(([, value]) => value)
			.map(([key, value]) => ({
				key,
				label: `${key === "dueDate" ? "Due date" : key}: ${TASK_STATUSES[value] || TASK_PRIORITIES[value] || DUE_DATE_FILTERS[value] || projects.find((p) => p.id === value)?.name || members.find((m) => m.id === value)?.name || (value === "unassigned" ? "Unassigned" : value)}`,
			})),
	];
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
				<TaskSearch key={search} value={search} onChange={setSearch} />
				<FilterDropdown
					filters={filters}
					onChange={setFilters}
					projects={projects}
					members={members}
				/>
			</div>
			{chips.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{chips.map((chip) => (
						<Badge key={chip.key} variant="secondary" className="gap-1 pr-1">
							{chip.label}
							<button
								type="button"
								onClick={() => updateQuery(chip.key, "")}
								aria-label={`Remove ${chip.label}`}
							>
								<X className="size-3" />
							</button>
						</Badge>
					))}
					<Button type="button" variant="ghost" onClick={clearFilters}>
						Clear all
					</Button>
				</div>
			)}
			{visible.length === 0 ? (
				<EmptyState
					title="No tasks found"
					description="Try changing your search or filters, or add a new task."
					action={
						chips.length > 0 ? (
							<Button type="button" variant="outline" onClick={clearFilters}>
								Clear filters
							</Button>
						) : undefined
					}
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
