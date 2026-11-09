export function searchTasks(tasks, query) {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return tasks;

	return tasks.filter((task) =>
		`${task.title} ${task.description}`.toLowerCase().includes(normalizedQuery),
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
					: task.assigneeId === filters.assigneeId)),
	);
}
