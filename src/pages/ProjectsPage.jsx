import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { CalendarDays, Check, ChevronDown, Search, SlidersHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getProjectProgress } from '@/data/seedData.js'
import { useProjectStore } from '@/store/projectStore.js'

const STATUSES = { all: 'All statuses', planned: 'Planned', active: 'Active', on_hold: 'On Hold', completed: 'Completed' }
const SORTS = { name: 'Name', startDate: 'Start date', dueDate: 'Due date', progress: 'Progress' }
const ORDERS = { asc: 'Ascending', desc: 'Descending' }

function localDateOnly() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(`${value}T12:00:00`))
}

function normalizeParams(params) {
  return {
    q: params.get('q') || '',
    status: Object.hasOwn(STATUSES, params.get('status')) ? params.get('status') : 'all',
    overdue: params.get('overdue') === 'true',
    sortBy: Object.hasOwn(SORTS, params.get('sortBy')) ? params.get('sortBy') : 'name',
    sortOrder: Object.hasOwn(ORDERS, params.get('sortOrder')) ? params.get('sortOrder') : 'asc',
  }
}

function filterAndSortProjects(projects, tasks, options, today = localDateOnly()) {
  const query = options.q.trim().toLocaleLowerCase()
  return projects
    .map((project) => ({ ...project, progress: getProjectProgress(project.id, tasks) }))
    .filter((project) => (!query || `${project.name} ${project.description}`.toLocaleLowerCase().includes(query)))
    .filter((project) => options.status === 'all' || project.status === options.status)
    .filter((project) => !options.overdue || (project.dueDate < today && project.status !== 'completed'))
    .sort((a, b) => {
      const aValue = options.sortBy === 'progress' ? a.progress : a[options.sortBy]
      const bValue = options.sortBy === 'progress' ? b.progress : b[options.sortBy]
      const result = typeof aValue === 'number' ? aValue - bValue : String(aValue).localeCompare(String(bValue))
      return (options.sortOrder === 'desc' ? -result : result) || a.name.localeCompare(b.name)
    })
}

function ProjectCard({ project }) {
  return <Link to={`/projects/${project.id}`} className="block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3"><CardTitle>{project.name}</CardTitle><Badge variant={project.status}>{STATUSES[project.status]}</Badge></div>
        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">{project.description}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground"><span><CalendarDays className="mr-1 inline size-3.5" />Start<br /><strong className="text-foreground">{formatDate(project.startDate)}</strong></span><span><CalendarDays className="mr-1 inline size-3.5" />Due<br /><strong className="text-foreground">{formatDate(project.dueDate)}</strong></span></div>
        <div className="space-y-1.5"><div className="flex justify-between text-xs"><span>Progress</span><strong>{project.progress}%</strong></div><div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={`${project.name} progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={project.progress}><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${project.progress}%` }} /></div></div>
      </CardContent>
    </Card>
  </Link>
}

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const projects = useProjectStore((state) => state.projects)
  const tasks = useProjectStore((state) => state.tasks)
  const options = normalizeParams(searchParams)
  const [query, setQuery] = useState(options.q)

  // URL changes from browser navigation must update the visible input.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setQuery(options.q), [options.q])
  useEffect(() => {
    if (query === options.q) return undefined
    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      query ? next.set('q', query) : next.delete('q')
      setSearchParams(next, { replace: true })
    }, 250)
    return () => clearTimeout(timer)
  }, [query, options.q, searchParams, setSearchParams])

  const update = (key, value) => {
    const next = new URLSearchParams(searchParams)
    const defaultValue = { status: 'all', overdue: false, sortBy: 'name', sortOrder: 'asc' }[key]
    if (value === defaultValue) next.delete(key)
    else next.set(key, String(value))
    setSearchParams(next)
  }
  const clearFilters = () => { setQuery(''); const next = new URLSearchParams(searchParams); ['q', 'status', 'overdue', 'sortBy', 'sortOrder'].forEach((key) => next.delete(key)); setSearchParams(next) }
  const { q, status, overdue, sortBy, sortOrder } = options
  const filteredProjects = useMemo(() => filterAndSortProjects(projects, tasks, { q, status, overdue, sortBy, sortOrder }), [projects, tasks, q, status, overdue, sortBy, sortOrder])
  const hasFilters = Boolean(options.q || options.status !== 'all' || options.overdue || options.sortBy !== 'name' || options.sortOrder !== 'asc')

  return <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"><div><h1>Projects</h1><p className="text-muted-foreground">Track progress and deadlines across your projects.</p></div><span className="text-sm text-muted-foreground">{filteredProjects.length} of {projects.length} projects</span></div>
    <Card><CardContent className="flex flex-col gap-4 p-4"><div className="relative"><Search aria-hidden="true" className="absolute left-2.5 top-2 size-4 text-muted-foreground" /><Input aria-label="Search projects" className="pl-8" placeholder="Search projects..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center"><Select value={options.status} onValueChange={(value) => update('status', value)}><SelectTrigger aria-label="Filter by status" className="w-full md:w-40"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(STATUSES).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select><Button type="button" variant={options.overdue ? 'default' : 'outline'} onClick={() => update('overdue', !options.overdue)}><Check className="size-4" />Overdue</Button><Select value={options.sortBy} onValueChange={(value) => update('sortBy', value)}><SelectTrigger aria-label="Sort projects by" className="w-full md:w-40"><SlidersHorizontal className="size-4" /><SelectValue /></SelectTrigger><SelectContent>{Object.entries(SORTS).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select><Select value={options.sortOrder} onValueChange={(value) => update('sortOrder', value)}><SelectTrigger aria-label="Sort order" className="w-full md:w-40"><ChevronDown className="size-4" /><SelectValue /></SelectTrigger><SelectContent>{Object.entries(ORDERS).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>{hasFilters && <Button type="button" variant="ghost" onClick={clearFilters}>Clear filters</Button>}</div></CardContent></Card>
    {projects.length === 0 ? <EmptyState title="No projects yet" description="Projects you create will appear here." /> : filteredProjects.length === 0 ? <EmptyState title="No matching projects" description="Try adjusting your search or filters." action={<Button type="button" variant="outline" onClick={clearFilters}>Clear filters</Button>} /> : <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>}
  </section>
}
