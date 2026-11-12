import { useProjectStore } from "@/store/projectStore.js";

export function createSubtask(subtask) {
	return useProjectStore.getState().addSubtask(subtask);
}

export function updateSubtask(subtaskId, changes) {
	return useProjectStore.getState().updateSubtask(subtaskId, changes);
}

export function updateSubtaskStatus(subtaskId, status) {
	return useProjectStore.getState().updateSubtaskStatus(subtaskId, status);
}

export function deleteSubtask(subtaskId) {
	return useProjectStore.getState().deleteSubtask(subtaskId);
}
