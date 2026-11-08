import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ProjectCard from '@/components/projects/ProjectCard.jsx'
import ProjectFormDialog from '@/components/projects/ProjectFormDialog.jsx'
import { toast } from '@/components/ui/sonner'
import { useProjectStore } from '@/store/projectStore.js'
import { createProject, deleteProject, updateProject } from '@/services/projects/projectCrudService.js'
import { getProjectsForList, PROJECT_STATUSES, SORT_FIELDS } from '@/services/projects/projectFilterService.js'

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
  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [deletingProject, setDeletingProject] = useState(null)

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

  function openCreate() { setEditingProject(null); setFormOpen(true) }
  function openEdit(project) { setEditingProject(project); setFormOpen(true) }
  function saveProject(values) {
    const successful = editingProject
      ? updateProject(editingProject.id, values)
      : createProject(values)
    if (!successful) { toast.error(`Could not ${editingProject ? 'update' : 'create'} project.`); return }
    toast.success(`Project ${editingProject ? 'updated' : 'created'} successfully.`)
    setFormOpen(false)
  }

  function confirmDelete(project) { setDeletingProject(project) }
  function removeProject() {
    const successful = deleteProject(deletingProject.id)
    if (!successful) toast.error('Could not delete project.')
    else toast.success('Project deleted successfully.')
    setDeletingProject(null)
  }

  const visibleProjects = useMemo(
    () => getProjectsForList(projects, tasks, filtersFromUrl),
    [projects, tasks, filtersFromUrl.search, filtersFromUrl.status, filtersFromUrl.overdue, filtersFromUrl.sortBy, filtersFromUrl.sortOrder],
  )
  const hasFilters = search || filtersFromUrl.status !== 'all' || filtersFromUrl.overdue || filtersFromUrl.sortBy !== 'name' || filtersFromUrl.sortOrder !== 'asc'

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
      <div className="flex items-start justify-between gap-4"><div><h1>Projects</h1><p className="text-muted-foreground">Track progress and deadlines across your projects.</p></div><Button type="button" onClick={openCreate}>Create project</Button></div>
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
      {projects.length === 0 ? <EmptyState title="No projects yet" description="Projects you create will appear here." /> : visibleProjects.length === 0 ? <EmptyState title="No matching projects" description="Try adjusting your search or filters." action={<Button type="button" variant="outline" onClick={clearFilters}>Clear filters</Button>} /> : <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} onEdit={openEdit} onDelete={confirmDelete} />)}</div>}
      <ProjectFormDialog open={formOpen} onOpenChange={setFormOpen} project={editingProject} onSubmit={saveProject} />
      <ConfirmDialog
        open={Boolean(deletingProject)}
        onOpenChange={(open) => { if (!open) setDeletingProject(null) }}
        title={`Delete “${deletingProject?.name}”?`}
        description={`This project has ${tasks.filter((task) => task.projectId === deletingProject?.id).length} associated task(s). Deleting the project will also delete its associated tasks.`}
        confirmLabel="Delete project"
        variant="destructive"
        onConfirm={removeProject}
      />
    </section>
  )
}
