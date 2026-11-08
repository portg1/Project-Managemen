import { getProjectProgress } from "@/data/seedData.js";

export const PROJECT_STATUSES = {
	all: "All statuses",
	planned: "Planned",
	active: "Active",
	on_hold: "On Hold",
	completed: "Completed",
};

export const SORT_FIELDS = {
	name: "Name",
	startDate: "Start date",
	dueDate: "Due date",
	progress: "Progress",
};

export const DEFAULT_FILTERS = {
	search: "",
	status: "all",
	overdue: false,
	sortBy: "name",
	sortOrder: "asc",
};

function getToday() {
	const date = new Date();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

export function getProjectsForList(projects, tasks, filters) {
	const search = filters.search.trim().toLowerCase();
	const today = getToday();

	return projects
		.map((project) => ({
			...project,
			progress: getProjectProgress(project.id, tasks),
		}))
		.filter((project) => matchesSearch(project, search))
		.filter((project) => matchesStatus(project, filters.status))
		.filter((project) => matchesOverdue(project, filters.overdue, today))
		.sort((first, second) => {
			const firstValue =
				filters.sortBy === "progress" ? first.progress : first[filters.sortBy];
			const secondValue =
				filters.sortBy === "progress"
					? second.progress
					: second[filters.sortBy];
			const result =
				typeof firstValue === "number"
					? firstValue - secondValue
					: String(firstValue).localeCompare(String(secondValue));
			return filters.sortOrder === "desc" ? -result : result;
		});
}

function matchesSearch(project, search) {
	if (!search) return true;
	const text = `${project.name} ${project.description}`.toLowerCase();
	return text.includes(search);
}

function matchesStatus(project, status) {
	return status === "all" || project.status === status;
}

function matchesOverdue(project, overdue, today) {
	return !overdue || (project.dueDate < today && project.status !== "completed");
}
