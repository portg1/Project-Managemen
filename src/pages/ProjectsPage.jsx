import { useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import ProjectDialogs from "@/components/projects/ProjectDialogs.jsx";
import ProjectFilters, {
	DEFAULT_FILTERS,
	getProjectsForList,
	readProjectFilters,
} from "@/components/projects/ProjectFilters.jsx";
import ProjectGrid from "@/components/projects/ProjectGrid.jsx";
import {
	createProject,
	deleteProject,
	updateProject,
} from "@/services/projects/projectCrudService.js";
import { useProjectStore } from "@/store/projectStore.js";

export default function ProjectsPage() {
	const [params, setParams] = useSearchParams();
	const projects = useProjectStore((state) => state.projects);
	const tasks = useProjectStore((state) => state.tasks);
	const filters = readProjectFilters(params);
	const [formOpen, setFormOpen] = useState(false);
	const [editingProject, setEditingProject] = useState(null);
	const [deletingProject, setDeletingProject] = useState(null);

	function updateFilter(name, value) {
		const next = new URLSearchParams(params);
		const defaultValue = DEFAULT_FILTERS[name];

		if (value === defaultValue || value === "") next.delete(name);
		else next.set(name, String(value));
		setParams(next, name === "q" ? { replace: true } : undefined);
	}

	function clearFilters() {
		const next = new URLSearchParams(params);
		["q", "status", "overdue", "sortBy", "sortOrder"].forEach((name) => {
			next.delete(name);
		});
		setParams(next);
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

	function removeProject() {
		const successful = deleteProject(deletingProject.id);
		if (!successful) toast.error("Could not delete project.");
		else toast.success("Project deleted successfully.");
		setDeletingProject(null);
	}

	const visibleProjects = getProjectsForList(projects, tasks, filters);
	const hasFilters = Object.keys(DEFAULT_FILTERS).some(
		(name) => filters[name] !== DEFAULT_FILTERS[name],
	);

	return (
		<section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1>Projects</h1>
					<p className="text-muted-foreground">
						Track progress and deadlines across your projects.
					</p>
				</div>
				<Button
					type="button"
					onClick={() => {
						setEditingProject(null);
						setFormOpen(true);
					}}
				>
					Create project
				</Button>
			</div>
			<ProjectFilters
				filters={filters}
				hasFilters={hasFilters}
				onSearchChange={(event) => updateFilter("q", event.target.value)}
				onFilterChange={updateFilter}
				onClear={clearFilters}
			/>
			<ProjectGrid
				projects={projects}
				visibleProjects={visibleProjects}
				onEdit={(project) => {
					setEditingProject(project);
					setFormOpen(true);
				}}
				onDelete={setDeletingProject}
				onClear={clearFilters}
			/>
			<ProjectDialogs
				formOpen={formOpen}
				setFormOpen={setFormOpen}
				editingProject={editingProject}
				deletingProject={deletingProject}
				tasks={tasks}
				setDeletingProject={setDeletingProject}
				onSave={saveProject}
				onRemove={removeProject}
			/>
		</section>
	);
}
