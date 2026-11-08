import { Card, CardContent } from '@/components/ui/card'

export default function UpcomingDeadlinesCard({ tasks }) {
  return <Card className="min-w-0"><CardContent className="p-5"><h2 className="text-base font-semibold">Upcoming Deadlines</h2><div className="mt-4 space-y-4">{tasks.map((task) => <div key={task.id} className="flex items-center justify-between gap-4 border-b pb-3 last:border-0"><span className="truncate text-sm">{task.title}</span><span className="shrink-0 text-xs text-muted-foreground">{task.dueDate}</span></div>)}</div></CardContent></Card>
}
