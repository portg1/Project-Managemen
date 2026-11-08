import { useMemo } from "react";
import { calculateDashboardStats } from "@/services/dashboardService";
import { useProjectStore } from "@/store/projectStore";

export function useDashboardPage() {
	const projects = useProjectStore((state) => state.projects);
	const tasks = useProjectStore((state) => state.tasks);
	const members = useProjectStore((state) => state.members);

	const dashboard = useMemo(
		() => calculateDashboardStats({ projects, tasks, members }),
		[projects, tasks, members],
	);

	const stats = useMemo(
		() => [
			{
				label: "Total Projects",
				value: dashboard.totalProjects,
				change: dashboard.changes.projects,
				icon: "FolderKanban",
			},
			{
				label: "Total Tasks",
				value: dashboard.totalTasks,
				change: dashboard.changes.tasks,
				icon: "ListChecks",
			},
			{
				label: "Members",
				value: dashboard.members,
				change: dashboard.changes.members,
				icon: "Users",
			},
			{
				label: "Productivity",
				value: `${dashboard.productivity}%`,
				change: dashboard.changes.productivity,
				icon: "BatteryMedium",
			},
		],
		[dashboard],
	);

	const projectProgress = useMemo(
		() => [
			{
				label: "Not Started",
				value: projects.filter((project) =>
					["planned", "on_hold"].includes(project.status),
				).length,
				color: "#dce3ed",
			},
			{
				label: "In Progress",
				value: projects.filter((project) => project.status === "active").length,
				color: "#3478df",
			},
			{
				label: "Completed",
				value: projects.filter((project) => project.status === "completed")
					.length,
				color: "#43b878",
			},
		],
		[projects],
	);

	const tasksByStatus = useMemo(
		() => [
			{
				label: "To Do",
				value: tasks.filter((task) => task.status === "todo").length,
				color: "#3478df",
			},
			{
				label: "In Progress",
				value: tasks.filter((task) => task.status === "in_progress").length,
				color: "#3478df",
			},
			{
				label: "Done",
				value: tasks.filter((task) => task.status === "done").length,
				color: "#43b878",
			},
		],
		[tasks],
	);

	const upcomingDeadlines = useMemo(
		() =>
			tasks
				.filter((task) => task.status !== "done")
				.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
				.slice(0, 4),
		[tasks],
	);

	return {
		stats,
		projectProgress,
		tasksByStatus,
		upcomingDeadlines,
		members,
		projectCount: projects.length,
	};
}
