import { Button } from '@/components/ui/button'
import ProjectDialogs from '@/components/projects/ProjectDialogs.jsx'
import ProjectFilters from '@/components/projects/ProjectFilters.jsx'
import ProjectGrid from '@/components/projects/ProjectGrid.jsx'
import { useProjectsPage } from '@/hooks/useProjectsPage.js'

export default function ProjectsPage() {
  const page = useProjectsPage()

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div><h1>Projects</h1><p className="text-muted-foreground">Track progress and deadlines across your projects.</p></div>
        <Button type="button" onClick={page.openCreate}>Create project</Button>
      </div>
      <ProjectFilters filters={page.filters} search={page.search} hasFilters={page.hasFilters} onSearchChange={page.handleSearchChange} onFilterChange={page.handleFilterChange} onClear={page.clearFilters} />
      <ProjectGrid projects={page.projects} visibleProjects={page.visibleProjects} onEdit={page.openEdit} onDelete={page.confirmDelete} onClear={page.clearFilters} />
      <ProjectDialogs formOpen={page.formOpen} setFormOpen={page.setFormOpen} editingProject={page.editingProject} deletingProject={page.deletingProject} tasks={page.tasks} setDeletingProject={page.setDeletingProject} onSave={page.saveProject} onRemove={page.removeProject} />
    </section>
  )
}
