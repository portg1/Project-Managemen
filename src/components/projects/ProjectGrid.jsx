import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import ProjectCard from "@/components/projects/ProjectCard.jsx";

export default function ProjectGrid({
	projects,
	visibleProjects,
	onEdit,
	onDelete,
	onClear,
}) {
	if (projects.length === 0)
		return (
			<EmptyState
				title="No projects yet"
				description="Projects you create will appear here."
			/>
		);
	if (visibleProjects.length === 0)
		return (
			<EmptyState
				title="No matching projects"
				description="Try adjusting your search or filters."
				action={
					<Button type="button" variant="outline" onClick={onClear}>
						Clear filters
					</Button>
				}
			/>
		);
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
			{visibleProjects.map((project) => (
				<ProjectCard
					key={project.id}
					project={project}
					onEdit={onEdit}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
}
