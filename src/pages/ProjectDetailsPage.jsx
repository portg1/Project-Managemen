import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import ProjectDetailsTabs from "@/components/projects/ProjectDetailsTabs.jsx";
import ProjectFormDialog from "@/components/projects/ProjectFormDialog.jsx";
import TaskFormDialog from "@/components/tasks/TaskFormDialog.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/sonner";
import { getProjectProgress } from "@/data/seedData.js";
import {
	deleteProject,
	updateProject,
} from "@/services/projects/projectCrudService.js";
import { useProjectStore } from "@/store/projectStore.js";
import { selectProjectById, selectTasksForProject } from "@/store/selectors.js";

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

export default function ProjectDetailsPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [formOpen, setFormOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [taskDialog, setTaskDialog] = useState({ open: false, task: null });
	const project = useProjectStore((state) => selectProjectById(state, id));
	const tasks = useProjectStore(
		useShallow((state) => selectTasksForProject(state, id)),
	);
	const members = useProjectStore((state) => state.members);
	const progress = useMemo(() => getProjectProgress(id, tasks), [id, tasks]);

	if (!project)
		return (
			<section className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 md:p-8">
				<h1>Project not found</h1>
				<p className="text-muted-foreground">
					This project may have been deleted or the link may be invalid.
				</p>
				<Button asChild className="w-fit">
					<Link to="/projects">Back to projects</Link>
				</Button>
			</section>
		);

	function saveProject(values) {
		if (!updateProject(project.id, values)) {
			toast.error("Could not update project.");
			return;
		}
		toast.success("Project updated successfully.");
		setFormOpen(false);
	}

	function removeProject() {
		if (!deleteProject(project.id)) {
			toast.error("Could not delete project.");
			return;
		}
		toast.success("Project deleted successfully.");
		navigate("/projects");
	}

	return (
		<section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
			<Link
				to="/projects"
				className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft aria-hidden="true" className="size-4" /> Back to projects
			</Link>
			<Card>
				<CardHeader className="gap-4 border-b sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0">
						<div className="mb-2 flex flex-wrap items-center gap-2">
							<Badge variant={project.status}>
								{PROJECT_STATUS_LABELS[project.status] || project.status}
							</Badge>
							{project.tag && <Badge variant="outline">{project.tag}</Badge>}
						</div>
						<CardTitle className="text-2xl">{project.name}</CardTitle>
						<p className="mt-2 max-w-3xl text-muted-foreground">
							{project.description || "No description provided."}
						</p>
					</div>
					<div className="flex shrink-0 gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setFormOpen(true)}
						>
							<Pencil aria-hidden="true" /> Edit
						</Button>
						<Button
							type="button"
							variant="danger"
							onClick={() => setDeleteOpen(true)}
						>
							<Trash2 aria-hidden="true" /> Delete
						</Button>
					</div>
				</CardHeader>
				<CardContent className="grid gap-6 pt-4 md:grid-cols-[1fr_1fr_2fr]">
					<div>
						<p className="text-sm text-muted-foreground">Start date</p>
						<p className="mt-1 font-medium">{formatDate(project.startDate)}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Due date</p>
						<p className="mt-1 font-medium">{formatDate(project.dueDate)}</p>
					</div>
					<div>
						<div className="mb-2 flex justify-between text-sm">
							<span className="text-muted-foreground">Progress</span>
							<span className="font-medium">{progress}%</span>
						</div>
						<div
							className="h-2 overflow-hidden rounded-full bg-muted"
							role="progressbar"
							aria-label="Project progress"
							aria-valuenow={progress}
							aria-valuemin="0"
							aria-valuemax="100"
						>
							<div
								className="h-full rounded-full bg-primary transition-all"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
			<ProjectDetailsTabs
				project={project}
				tasks={tasks}
				members={members}
				progress={progress}
				onAddTask={() => setTaskDialog({ open: true, task: null })}
				onEditTask={(task) => setTaskDialog({ open: true, task })}
			/>
			<TaskFormDialog
				open={taskDialog.open}
				onOpenChange={(open) => setTaskDialog((d) => ({ ...d, open }))}
				task={taskDialog.task}
				projectId={project.id}
			/>
			<ProjectFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				project={project}
				onSubmit={saveProject}
			/>
			<ConfirmDialog
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				title={`Delete “${project.name}”?`}
				description="Deleting this project will also delete its related tasks."
				confirmLabel="Delete project"
				variant="destructive"
				onConfirm={removeProject}
			/>
		</section>
	);
}
