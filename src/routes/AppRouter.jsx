import { Route, Routes } from "react-router";
import DashboardPage from "../pages/DashboardPage.jsx";
import MemberDetailsPage from "../pages/MemberDetailsPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import ProjectDetailsPage from "../pages/ProjectDetailsPage.jsx";
import ProjectsPage from "../pages/ProjectsPage.jsx";
import TasksPage from "../pages/TasksPage.jsx";
import TeamPage from "../pages/TeamPage.jsx";
import "./AppRouter.css";

export default function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={<DashboardPage />} />
			<Route path="/projects" element={<ProjectsPage />} />
			<Route path="/projects/:id" element={<ProjectDetailsPage />} />
			<Route path="/tasks" element={<TasksPage />} />
			<Route path="/team" element={<TeamPage />} />
			<Route path="/team/:id" element={<MemberDetailsPage />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}
