import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const DEFAULT_PROJECT = {
  name: '',
  description: '',
  status: 'planned',
  startDate: '',
  dueDate: '',
}

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Name is required.'
  if (values.startDate && values.dueDate && values.dueDate < values.startDate) {
    errors.dueDate = 'Due date must not precede the start date.'
  }
  return errors
}

export default function ProjectFormDialog({ open, onOpenChange, project, onSubmit }) {
  const [values, setValues] = useState(DEFAULT_PROJECT)
  const [errors, setErrors] = useState({})
  const editing = Boolean(project)

  // Reset the draft when the dialog opens or the selected project changes.
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues(project ? { ...DEFAULT_PROJECT, ...project } : DEFAULT_PROJECT)
      setErrors({})
    }
  }, [open, project])

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function submit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({ ...values, name: values.name.trim(), description: values.description.trim() })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit project' : 'Create project'}</DialogTitle>
          <DialogDescription>{editing ? 'Update the project details.' : 'Add a project to start tracking its work.'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-1.5">
            <label htmlFor="project-name" className="text-sm font-medium">Name</label>
            <Input id="project-name" value={values.name} onChange={(event) => updateField('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'project-name-error' : undefined} />
            {errors.name && <p id="project-name-error" role="alert" className="text-sm text-destructive">{errors.name}</p>}
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="project-description" className="text-sm font-medium">Description</label>
            <Textarea id="project-description" value={values.description} onChange={(event) => updateField('description', event.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="project-status" className="text-sm font-medium">Status</label>
            <Select value={values.status} onValueChange={(value) => updateField('status', value)}>
              <SelectTrigger id="project-status"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="planned">Planned</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="on_hold">On Hold</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <DatePicker label="Start date" value={values.startDate} onChange={(event) => updateField('startDate', event.target.value)} />
            <DatePicker label="Due date" value={values.dueDate} onChange={(event) => updateField('dueDate', event.target.value)} error={errors.dueDate} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Save changes' : 'Create project'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
