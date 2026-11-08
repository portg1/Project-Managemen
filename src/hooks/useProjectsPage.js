import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "@/components/ui/sonner";
import { useProjectStore } from "@/store/projectStore.js";
import {
	createProject,
	deleteProject,
	updateProject,
} from "@/services/projects/projectCrudService.js";
import {
	getProjectsForList,
	PROJECT_STATUSES,
	SORT_FIELDS,
} from "@/services/projects/projectFilterService.js";

function readFilters(params) {
	const status = params.get("status");
	const sortBy = params.get("sortBy");

	return {
		search: params.get("q") || "",
		status: Object.hasOwn(PROJECT_STATUSES, status) ? status : "all",
		overdue: params.get("overdue") === "true",
		sortBy: Object.hasOwn(SORT_FIELDS, sortBy) ? sortBy : "name",
		sortOrder: params.get("sortOrder") === "desc" ? "desc" : "asc",
	};
}

export function useProjectsPage() {
	const [params, setParams] = useSearchParams();
	const projects = useProjectStore((state) => state.projects);
	const tasks = useProjectStore((state) => state.tasks);
	const filters = readFilters(params);
	const [search, setSearch] = useState(filters.search);
	const [formOpen, setFormOpen] = useState(false);
	const [editingProject, setEditingProject] = useState(null);
	const [deletingProject, setDeletingProject] = useState(null);

	// Keep the search input in sync with the URL after browser back/forward navigation.
	// eslint-disable-next-line react-hooks/set-state-in-effect
	useEffect(() => setSearch(filters.search), [filters.search]);

	function handleSearchChange(event) {
		const value = event.target.value;
		setSearch(value);
		const nextParams = new URLSearchParams(params);
		if (value) nextParams.set("q", value);
		else nextParams.delete("q");
		setParams(nextParams, { replace: true });
	}

	function handleFilterChange(name, value) {
		const next = new URLSearchParams(params);
		const defaultValue = {
			status: "all",
			overdue: false,
			sortBy: "name",
			sortOrder: "asc",
		}[name];
		if (value === defaultValue) next.delete(name);
		else next.set(name, String(value));
		setParams(next);
	}

	function clearFilters() {
		setSearch("");
		const next = new URLSearchParams(params);
		["q", "status", "overdue", "sortBy", "sortOrder"].forEach((name) =>
			next.delete(name),
		);
		setParams(next);
	}

	function openCreate() {
		setEditingProject(null);
		setFormOpen(true);
	}
	function openEdit(project) {
		setEditingProject(project);
		setFormOpen(true);
	}
	function saveProject(values) {
		const successful = editingProject
			? updateProject(editingProject.id, values)
			: createProject(values);
		if (!successful) {
			toast.error(`Could not ${editingProject ? "update" : "create"} project.`);
			return;
		}
		toast.success(
			`Project ${editingProject ? "updated" : "created"} successfully.`,
		);
		setFormOpen(false);
	}

	function confirmDelete(project) {
		setDeletingProject(project);
	}
	function removeProject() {
		const successful = deleteProject(deletingProject.id);
		if (!successful) toast.error("Could not delete project.");
		else toast.success("Project deleted successfully.");
		setDeletingProject(null);
	}

	const visibleProjects = useMemo(
		() =>
			getProjectsForList(projects, tasks, {
				search: filters.search,
				status: filters.status,
				overdue: filters.overdue,
				sortBy: filters.sortBy,
				sortOrder: filters.sortOrder,
			}),
		[
			projects,
			tasks,
			filters.search,
			filters.status,
			filters.overdue,
			filters.sortBy,
			filters.sortOrder,
		],
	);
	const hasFilters =
		search ||
		filters.status !== "all" ||
		filters.overdue ||
		filters.sortBy !== "name" ||
		filters.sortOrder !== "asc";

	return {
		projects,
		tasks,
		visibleProjects,
		filters,
		search,
		hasFilters,
		formOpen,
		setFormOpen,
		editingProject,
		deletingProject,
		setDeletingProject,
		handleSearchChange,
		handleFilterChange,
		clearFilters,
		openCreate,
		openEdit,
		saveProject,
		confirmDelete,
		removeProject,
	};
}
