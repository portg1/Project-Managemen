import { validateData } from "../data/seedData.js";

const VALID_STATUSES = ["todo", "in_progress", "done"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

export function isObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function hasUniqueId(items) {
	return (
		Array.isArray(items) &&
		items.every((item) => isObject(item) && typeof item.id === "string") &&
		new Set(items.map((item) => item.id)).size === items.length
	);
}

export function isValidProject(project) {
	return (
		isObject(project) &&
		typeof project.id === "string" &&
		typeof project.name === "string" &&
		typeof project.description === "string" &&
		typeof project.status === "string" &&
		typeof project.startDate === "string" &&
		typeof project.dueDate === "string"
	);
}

export function isValidTask(task, projectIds, memberIds) {
	return (
		isObject(task) &&
		typeof task.id === "string" &&
		typeof task.title === "string" &&
		typeof task.description === "string" &&
		projectIds.has(task.projectId) &&
		(task.assigneeId === null || memberIds.has(task.assigneeId)) &&
		VALID_PRIORITIES.includes(task.priority) &&
		VALID_STATUSES.includes(task.status) &&
		typeof task.dueDate === "string" &&
		typeof task.createdAt === "string"
	);
}

export function isValidSubtask(subtask, taskIds) {
	return (
		isObject(subtask) &&
		typeof subtask.id === "string" &&
		taskIds.has(subtask.taskId) &&
		typeof subtask.title === "string" &&
		VALID_STATUSES.includes(subtask.status) &&
		typeof subtask.createdAt === "string"
	);
}

export function isValidStoreState(value) {
	if (
		!isObject(value) ||
		!hasUniqueId(value.projects) ||
		!hasUniqueId(value.tasks) ||
		!hasUniqueId(value.subtasks) ||
		!hasUniqueId(value.members) ||
		!value.projects.every(isValidProject)
	) {
		return false;
	}

	const projectIds = new Set(value.projects.map((project) => project.id));
	const memberIds = new Set(value.members.map((member) => member.id));
	const taskIds = new Set(value.tasks.map((task) => task.id));
	return (
		value.tasks.every((task) => isValidTask(task, projectIds, memberIds)) &&
		value.subtasks.every((subtask) => isValidSubtask(subtask, taskIds)) &&
		validateData(value)
	);
}

export { VALID_PRIORITIES, VALID_STATUSES };
