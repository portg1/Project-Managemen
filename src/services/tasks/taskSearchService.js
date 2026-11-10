export function searchTasks(tasks, query) {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return tasks;

	return tasks.filter((task) =>
		`${task.title} ${task.description}`.toLowerCase().includes(normalizedQuery),
	);
}

export const TASK_STATUSES = {
	todo: "To Do",
	in_progress: "In Progress",
	done: "Done",
};
export const TASK_PRIORITIES = { Low: "Low", Medium: "Medium", High: "High" };
export const DUE_DATE_FILTERS = {
	overdue: "Overdue",
	today: "Today",
	thisWeek: "This week",
	noDueDate: "No due date",
};

export const DEFAULT_TASK_FILTERS = {
	status: "",
	priority: "",
	assigneeId: "",
	projectId: "",
	dueDate: "",
};

function localDateString(date) {
	return [
		date.getFullYear(),
		String(date.getMonth() + 1).padStart(2, "0"),
		String(date.getDate()).padStart(2, "0"),
	].join("-");
}

function getDateValues() {
	const now = new Date();
	const day = now.getDay();
	const monday = new Date(now);
	monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);
	return {
		today: localDateString(now),
		weekStart: localDateString(monday),
		weekEnd: localDateString(sunday),
	};
}

function matchesDueDate(task, value) {
	if (!value) return true;
	if (value === "noDueDate") return !task.dueDate;
	if (!task.dueDate) return false;
	const { today, weekStart, weekEnd } = getDateValues();
	if (value === "overdue") return task.dueDate < today;
	if (value === "today") return task.dueDate === today;
	return (
		value === "thisWeek" && task.dueDate >= weekStart && task.dueDate <= weekEnd
	);
}

export function filterTasks(tasks, filters) {
	return tasks.filter(
		(task) =>
			(!filters.status || task.status === filters.status) &&
			(!filters.priority || task.priority === filters.priority) &&
			(!filters.projectId || task.projectId === filters.projectId) &&
			(!filters.assigneeId ||
				(filters.assigneeId === "unassigned"
					? !task.assigneeId
					: task.assigneeId === filters.assigneeId)) &&
			matchesDueDate(task, filters.dueDate),
	);
}

export function filterAndSearchTasks(tasks, query, filters) {
	return filterTasks(searchTasks(tasks, query), filters);
}
