export function calculateDashboardStats({
	projects = [],
	tasks = [],
	members = [],
	previousPeriod,
}) {
	const completedTasks = tasks.filter((task) => task.status === "done").length;

	return {
		totalProjects: projects.length,
		totalTasks: tasks.length,
		members: members.length,
		productivity: calculateProductivity(tasks),
		changes: {
			projects: calculateChange(projects.length, previousPeriod?.projects),
			tasks: calculateChange(tasks.length, previousPeriod?.tasks),
			members: calculateChange(members.length, previousPeriod?.members),
			productivity: calculateChange(
				calculateProductivity(tasks),
				previousPeriod?.productivity,
			),
		},
	};
}

export function calculateChange(currentValue, previousValue) {
	if (previousValue == null || previousValue === 0) return null;

	return ((currentValue - previousValue) / previousValue) * 100;
}

export function calculateProductivity(tasks = []) {
	if (tasks.length === 0) return 0;

	const completedTasks = tasks.filter((task) => task.status === "done").length;
	return Math.round((completedTasks / tasks.length) * 1000) / 10;
}
