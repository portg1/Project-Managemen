import { isValidProject } from "../validation.js";

export const createProjectSlice = (set, get) => ({
	addProject: (project) => {
		if (
			!isValidProject(project) ||
			get().projects.some((item) => item.id === project.id)
		)
			return false;
		set((state) => ({ projects: [...state.projects, { ...project }] }));
		return true;
	},

	updateProject: (projectId, changes) => {
		const current = get().projects.find((project) => project.id === projectId);
		if (!current) return false;
		const updated = { ...current, ...changes, id: projectId };
		if (!isValidProject(updated)) return false;
		set((state) => ({
			projects: state.projects.map((project) =>
				project.id === projectId ? updated : project,
			),
		}));
		return true;
	},

	deleteProject: (projectId) => {
		if (!get().projects.some((project) => project.id === projectId))
			return false;
		set((state) => {
			const deletedTaskIds = new Set(
				state.tasks
					.filter((task) => task.projectId === projectId)
					.map((task) => task.id),
			);
			return {
				projects: state.projects.filter((project) => project.id !== projectId),
				tasks: state.tasks.filter((task) => task.projectId !== projectId),
				subtasks: state.subtasks.filter(
					(subtask) => !deletedTaskIds.has(subtask.taskId),
				),
			};
		});
		return true;
	},
});
