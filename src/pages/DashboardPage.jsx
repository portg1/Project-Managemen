import { calculateDashboardStats } from "@/services/dashboardService";
import { useProjectStore } from "@/store/projectStore";
import DashboardStats from "@/components/dashboard/DashboardStats";
import MembersCard from "@/components/dashboard/MembersCard";
import ProjectProgressCard from "@/components/dashboard/ProjectProgressCard";
import TasksByStatusCard from "@/components/dashboard/TasksByStatusCard";
import UpcomingDeadlinesCard from "@/components/dashboard/UpcomingDeadlinesCard";
export default function DashboardPage() {
	const projects = useProjectStore((state) => state.projects);
	const tasks = useProjectStore((state) => state.tasks);
	const members = useProjectStore((state) => state.members);
	const dashboard = calculateDashboardStats({ projects, tasks, members });

	const stats = [
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
	];

	const projectProgress = [
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
	];

	const tasksByStatus = [
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
	];

	const upcomingDeadlines = tasks
		.filter((task) => task.status !== "done")
		.sort((first, second) => first.dueDate.localeCompare(second.dueDate))
		.slice(0, 4);

	return (
		<section className="space-y-6">
			<DashboardStats stats={stats} />
			<div className="grid gap-4 lg:grid-cols-3">
				<ProjectProgressCard
					data={projectProgress}
					projectCount={projects.length}
				/>
				<TasksByStatusCard data={tasksByStatus} />
				<UpcomingDeadlinesCard tasks={upcomingDeadlines} />
			</div>
			<MembersCard members={members} />
		</section>
	);
}
