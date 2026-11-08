import DashboardStats from '@/components/dashboard/DashboardStats'
import MembersCard from '@/components/dashboard/MembersCard'
import ProjectProgressCard from '@/components/dashboard/ProjectProgressCard'
import TasksByStatusCard from '@/components/dashboard/TasksByStatusCard'
import UpcomingDeadlinesCard from '@/components/dashboard/UpcomingDeadlinesCard'
import { useDashboardPage } from '@/hooks/useDashboardPage'

export default function DashboardPage() {
  const dashboard = useDashboardPage()

  return (
    <section className="space-y-6">
      <DashboardStats stats={dashboard.stats} />
      <div className="grid gap-4 lg:grid-cols-3">
        <ProjectProgressCard data={dashboard.projectProgress} projectCount={dashboard.projectCount} />
        <TasksByStatusCard data={dashboard.tasksByStatus} />
        <UpcomingDeadlinesCard tasks={dashboard.upcomingDeadlines} />
      </div>
      <MembersCard members={dashboard.members} />
    </section>
  )
}
