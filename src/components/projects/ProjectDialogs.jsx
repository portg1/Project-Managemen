import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import ProjectFormDialog from "@/components/projects/ProjectFormDialog.jsx";

export default function ProjectDialogs({
	formOpen,
	setFormOpen,
	editingProject,
	deletingProject,
	tasks,
	setDeletingProject,
	onSave,
	onRemove,
}) {
	return (
		<>
			<ProjectFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				project={editingProject}
				onSubmit={onSave}
			/>
			<ConfirmDialog
				open={Boolean(deletingProject)}
				onOpenChange={(open) => {
					if (!open) setDeletingProject(null);
				}}
				title={`Delete “${deletingProject?.name}”?`}
				description={`This project has ${tasks.filter((task) => task.projectId === deletingProject?.id).length} associated task(s). Deleting the project will also delete its associated tasks.`}
				confirmLabel="Delete project"
				variant="destructive"
				onConfirm={onRemove}
			/>
		</>
	);
}
