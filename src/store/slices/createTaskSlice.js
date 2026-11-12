import { isValidTask, VALID_STATUSES } from "../validation.js";

const getReferences = (state) => ({
	projectIds: new Set(state.projects.map((project) => project.id)),
	memberIds: new Set(state.members.map((member) => member.id)),
});

export const createTaskSlice = (set, get) => ({
	addTask: (task) => {
		const state = get();
		const { projectIds, memberIds } = getReferences(state);
		if (
			!isValidTask(task, projectIds, memberIds) ||
			state.tasks.some((item) => item.id === task.id)
		)
			return false;
		set((current) => ({ tasks: [...current.tasks, { ...task }] }));
		return true;
	},

	updateTask: (taskId, changes) => {
		const state = get();
		const current = state.tasks.find((task) => task.id === taskId);
		if (!current) return false;
		const updated = { ...current, ...changes, id: taskId };
		const { projectIds, memberIds } = getReferences(state);
		if (!isValidTask(updated, projectIds, memberIds)) return false;
		set((currentState) => ({
			tasks: currentState.tasks.map((task) =>
				task.id === taskId ? updated : task,
			),
		}));
		return true;
	},

	deleteTask: (taskId) => {
		if (!get().tasks.some((task) => task.id === taskId)) return false;
		set((state) => ({
			tasks: state.tasks.filter((task) => task.id !== taskId),
			subtasks: state.subtasks.filter((subtask) => subtask.taskId !== taskId),
		}));
		return true;
	},

	updateTaskStatus: (taskId, status) => {
		const current = get().tasks.find((task) => task.id === taskId);
		if (
			!VALID_STATUSES.includes(status) ||
			!current ||
			current.status === status
		)
			return false;
		const activity = {
			id: crypto.randomUUID(),
			taskId,
			previousStatus: current.status,
			newStatus: status,
			timestamp: new Date().toISOString(),
		};
		set((state) => ({
			tasks: state.tasks.map((task) =>
				task.id === taskId ? { ...task, status } : task,
			),
			activities: [...(state.activities || []), activity],
		}));
		return true;
	},
});
