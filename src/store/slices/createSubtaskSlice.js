import { isValidSubtask, VALID_STATUSES } from "../validation.js";

const getTaskIds = (state) => new Set(state.tasks.map((task) => task.id));

export const createSubtaskSlice = (set, get) => ({
	addSubtask: (subtask) => {
		const state = get();
		if (
			!isValidSubtask(subtask, getTaskIds(state)) ||
			state.subtasks.some((item) => item.id === subtask.id)
		)
			return false;
		set((current) => ({ subtasks: [...current.subtasks, { ...subtask }] }));
		return true;
	},

	updateSubtask: (subtaskId, changes) => {
		const state = get();
		const current = state.subtasks.find((subtask) => subtask.id === subtaskId);
		if (!current) return false;
		const updated = { ...current, ...changes, id: subtaskId };
		if (!isValidSubtask(updated, getTaskIds(state))) return false;
		set((currentState) => ({
			subtasks: currentState.subtasks.map((subtask) =>
				subtask.id === subtaskId ? updated : subtask,
			),
		}));
		return true;
	},

	updateSubtaskStatus: (subtaskId, status) => {
		const current = get().subtasks.find((subtask) => subtask.id === subtaskId);
		if (
			!VALID_STATUSES.includes(status) ||
			!current ||
			current.status === status
		)
			return false;
		set((state) => ({
			subtasks: state.subtasks.map((subtask) =>
				subtask.id === subtaskId ? { ...subtask, status } : subtask,
			),
		}));
		return true;
	},

	deleteSubtask: (subtaskId) => {
		if (!get().subtasks.some((subtask) => subtask.id === subtaskId)) return false;
		set((state) => ({
			subtasks: state.subtasks.filter((subtask) => subtask.id !== subtaskId),
		}));
		return true;
	},
});
