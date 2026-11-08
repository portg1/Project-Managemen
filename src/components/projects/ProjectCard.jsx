import { Link } from 'react-router'
import { CalendarDays } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PROJECT_STATUSES } from '@/services/projectListService.js'

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
    .format(new Date(`${value}T12:00:00`))
}

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`} className="block h-full">
      <Card className="h-full hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle>{project.name}</CardTitle>
            <Badge variant={project.status}>
              {PROJECT_STATUSES[project.status]}
            </Badge>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <CalendarDays className="mr-1 inline size-3.5" />
              Start
              <strong className="block text-foreground">
                {formatDate(project.startDate)}
              </strong>
            </div>
            <div>
              <CalendarDays className="mr-1 inline size-3.5" />
              Due
              <strong className="block text-foreground">
                {formatDate(project.dueDate)}
              </strong>
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span>Progress</span>
              <strong>{project.progress}%</strong>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label={`${project.name} progress`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={project.progress}
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
