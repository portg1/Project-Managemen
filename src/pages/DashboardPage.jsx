import {
  FolderKanban,
  ListChecks,
  Users,
  BatteryMedium,
  TrendingUp,
} from "lucide-react"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { calculateDashboardStats } from "@/services/dashboardService"
import { useProjectStore } from "@/store/projectStore"


export default function DashboardPage() {

  const projects = useProjectStore((state) => state.projects)
  const tasks = useProjectStore((state) => state.tasks)
  const members = useProjectStore((state) => state.members)


  const dashboard = useMemo(
    () =>
      calculateDashboardStats({
        projects,
        tasks,
        members,
      }),
    [projects, tasks, members],
  )
  const projectProgress = [
  {
    label: "Not Started",
    value: projects.filter((project) =>
      ["planned", "on_hold"].includes(project.status)
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
    value: projects.filter((project) => project.status === "completed").length,
    color: "#43b878",
  },
]

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
]

  const stats = [
    {
      label: "Total Projects",
      value: dashboard.totalProjects,
      change: dashboard.changes.projects,
      icon: FolderKanban,
    },
    {
      label: "Total Tasks",
      value: dashboard.totalTasks,
      change: dashboard.changes.tasks,
      icon: ListChecks,
    },
    {
      label: "Members",
      value: dashboard.members,
      change: dashboard.changes.members,
      icon: Users,
    },
    {
      label: "Productivity",
      value: `${dashboard.productivity}%`,
      change: dashboard.changes.productivity,
      icon: BatteryMedium,
    },
  ]

  const upcomingDeadlines = tasks
    .filter((task) => task.status !== "done")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4)

  return (
    <section className="space-y-6">
      

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Card
              key={stat.label}
              className={`border-0 shadow-none ${stat.color}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {stat.label}
                  </span>
                  <Icon className="size-6" />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <strong className="text-3xl font-semibold">
                    {stat.value}
                  </strong>

                  <span className="flex items-center gap-1 text-sm">
                    {stat.change}
                    <TrendingUp className="size-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}

      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="min-w-0">
          <CardContent className="p-5">
            <h2 className="text-base font-semibold">Project Progress</h2>

            <div className="mt-4 flex items-center gap-6">
              <div className="relative mx-auto size-44">
                <PieChart width={176} height={176}>
                  <Pie
                    data={projectProgress}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={58}
                    outerRadius={78}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {projectProgress.map((item) => (
                      <Cell key={item.label} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>

                <div className="absolute inset-0 flex items-center justify-center">
                  <strong>
                    {projects.length
                      ? Math.round(
                          (projectProgress[2].value / projects.length) * 100
                        )
                      : 0}
                    %
                  </strong>
                </div>
              </div>

              <div className="space-y-4">
                {projectProgress.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-6 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.label}
                    </span>

                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardContent className="p-5">
            <h2 className="text-base font-semibold">Tasks by Status</h2>

            <ChartContainer
              config={{
                value: {
                  label: "Tasks",
                  color: "#3478df",
                },
              }}
              className="mt-4 h-56 w-full"
            >
              <BarChart
                data={tasksByStatus}
                margin={{ top: 20, right: 12, left: -20, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={52}
                >
                  {tasksByStatus.map((item) => (
                    <Cell key={item.label} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardContent className="p-5">
            <h2 className="text-base font-semibold">Upcoming Deadlines</h2>

            <div className="mt-4 space-y-4">
              {upcomingDeadlines.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-4 border-b pb-3 last:border-0"
                >
                  <span className="truncate text-sm">{task.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {task.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Members</h2>
            <span className="text-sm text-muted-foreground">
              {members.length} total
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Avatar>
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.jobTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>



  )
}
