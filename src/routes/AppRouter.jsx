import { BrowserRouter, NavLink, Outlet, Route, Routes } from 'react-router'
import DashboardPage from '../pages/DashboardPage.jsx'
import MemberDetailsPage from '../pages/MemberDetailsPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import ProjectDetailsPage from '../pages/ProjectDetailsPage.jsx'
import ProjectsPage from '../pages/ProjectsPage.jsx'
import TasksPage from '../pages/TasksPage.jsx'
import TeamPage from '../pages/TeamPage.jsx'
import './AppRouter.css'

function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="brand" to="/">Project Manager</NavLink>
        <nav aria-label="Main navigation">
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/team">Team</NavLink>
        </nav>
      </header>
      <main className="app-content"><Outlet /></main>
    </div>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/:id" element={<MemberDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
