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

export function isValidStoreState(value) {
	if (
		!isObject(value) ||
		!hasUniqueId(value.projects) ||
		!hasUniqueId(value.tasks) ||
		!hasUniqueId(value.members) ||
		!value.projects.every(isValidProject)
	) {
		return false;
	}

	const projectIds = new Set(value.projects.map((project) => project.id));
	const memberIds = new Set(value.members.map((member) => member.id));
	return (
		value.tasks.every((task) => isValidTask(task, projectIds, memberIds)) &&
		validateData(value)
	);
}

export { VALID_PRIORITIES, VALID_STATUSES };
