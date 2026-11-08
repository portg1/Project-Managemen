import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ProjectCard from '@/components/projects/ProjectCard.jsx'
import { useProjectStore } from '@/store/projectStore.js'
import { getProjectsForList, PROJECT_STATUSES, SORT_FIELDS } from '@/services/projectListService.js'

function readFilters(params) {
  const status = params.get('status')
  const sortBy = params.get('sortBy')

  return {
    search: params.get('q') || '',
    status: Object.hasOwn(PROJECT_STATUSES, status) ? status : 'all',
    overdue: params.get('overdue') === 'true',
    sortBy: Object.hasOwn(SORT_FIELDS, sortBy) ? sortBy : 'name',
    sortOrder: params.get('sortOrder') === 'desc' ? 'desc' : 'asc',
  }
}

export default function ProjectsPage() {
  const [params, setParams] = useSearchParams()
  const projects = useProjectStore((state) => state.projects)
  const tasks = useProjectStore((state) => state.tasks)
  const filtersFromUrl = readFilters(params)
  const [search, setSearch] = useState(filtersFromUrl.search)

  // Keep the input correct when browser back/forward changes the URL.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setSearch(filtersFromUrl.search), [filtersFromUrl.search])

  // Update the URL only after the user stops typing for 250ms.
  useEffect(() => {
    if (search === filtersFromUrl.search) return undefined
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params)
      if (search) next.set('q', search)
      else next.delete('q')
      setParams(next, { replace: true })
    }, 250)
    return () => clearTimeout(timer)
  }, [search, filtersFromUrl.search, params, setParams])

  function changeFilter(name, value) {
    if (name === 'search') {
      setSearch(value)
      return
    }

    const next = new URLSearchParams(params)
    const defaultValue = { status: 'all', overdue: false, sortBy: 'name', sortOrder: 'asc' }[name]
    if (value === defaultValue) next.delete(name)
    else next.set(name, String(value))
    setParams(next)
  }

  function clearFilters() {
    setSearch('')
    const next = new URLSearchParams(params)
    ;['q', 'status', 'overdue', 'sortBy', 'sortOrder'].forEach((name) => next.delete(name))
    setParams(next)
  }

  const visibleProjects = useMemo(
    () => getProjectsForList(projects, tasks, filtersFromUrl),
    [projects, tasks, filtersFromUrl.search, filtersFromUrl.status, filtersFromUrl.overdue, filtersFromUrl.sortBy, filtersFromUrl.sortOrder],
  )
  const hasFilters = search || filtersFromUrl.status !== 'all' || filtersFromUrl.overdue || filtersFromUrl.sortBy !== 'name' || filtersFromUrl.sortOrder !== 'asc'

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
      <div><h1>Projects</h1><p className="text-muted-foreground">Track progress and deadlines across your projects.</p></div>
      <Card><CardContent className="flex flex-col gap-4 p-4">
        <div className="relative"><Search className="absolute left-2.5 top-2 size-4 text-muted-foreground" /><Input aria-label="Search projects" className="pl-8" placeholder="Search projects..." value={search} onChange={(event) => changeFilter('search', event.target.value)} /></div>
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
          <Select value={filtersFromUrl.status} onValueChange={(value) => changeFilter('status', value)}><SelectTrigger aria-label="Filter by status" className="w-full md:w-40"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(PROJECT_STATUSES).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>
          <Button type="button" variant={filtersFromUrl.overdue ? 'default' : 'outline'} onClick={() => changeFilter('overdue', !filtersFromUrl.overdue)}>Overdue</Button>
          <Select value={filtersFromUrl.sortBy} onValueChange={(value) => changeFilter('sortBy', value)}><SelectTrigger aria-label="Sort projects by" className="w-full md:w-40"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(SORT_FIELDS).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>
          <Select value={filtersFromUrl.sortOrder} onValueChange={(value) => changeFilter('sortOrder', value)}><SelectTrigger aria-label="Sort order" className="w-full md:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="asc">Ascending</SelectItem><SelectItem value="desc">Descending</SelectItem></SelectContent></Select>
          {hasFilters && <Button type="button" variant="ghost" onClick={clearFilters}>Clear filters</Button>}
        </div>
      </CardContent></Card>
      {projects.length === 0 ? <EmptyState title="No projects yet" description="Projects you create will appear here." /> : visibleProjects.length === 0 ? <EmptyState title="No matching projects" description="Try adjusting your search or filters." action={<Button type="button" variant="outline" onClick={clearFilters}>Clear filters</Button>} /> : <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>}
    </section>
  )
}
