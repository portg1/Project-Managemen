import { useProjectStore } from "@/store/projectStore.js";

export function createTask(task) {
	return useProjectStore.getState().addTask(task);
}

export function updateTask(taskId, changes) {
	return useProjectStore.getState().updateTask(taskId, changes);
}

export function deleteTask(taskId) {
	return useProjectStore.getState().deleteTask(taskId);
}

export function updateTaskStatus(taskId, status) {
	return useProjectStore.getState().updateTaskStatus(taskId, status);
}
