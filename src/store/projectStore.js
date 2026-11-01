import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getInitialData,
  validateData,
} from '../data/seedData.js'

const STORAGE_KEY = 'project-management-store'
const VALID_STATUSES = ['todo', 'in_progress', 'done']
const VALID_PRIORITIES = ['Low', 'Medium', 'High']

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function hasUniqueId(items) {
  return Array.isArray(items)
    && items.every((item) => isObject(item) && typeof item.id === 'string')
    && new Set(items.map((item) => item.id)).size === items.length
}

function isValidProject(project) {
  return isObject(project)
    && typeof project.id === 'string'
    && typeof project.name === 'string'
    && typeof project.description === 'string'
    && typeof project.status === 'string'
    && typeof project.startDate === 'string'
    && typeof project.dueDate === 'string'
}

function isValidTask(task, projectIds, memberIds) {
  return isObject(task)
    && typeof task.id === 'string'
    && typeof task.title === 'string'
    && typeof task.description === 'string'
    && projectIds.has(task.projectId)
    && memberIds.has(task.assigneeId)
    && VALID_PRIORITIES.includes(task.priority)
    && VALID_STATUSES.includes(task.status)
    && typeof task.dueDate === 'string'
    && typeof task.createdAt === 'string'
}

function isValidStoreState(value) {
  if (!isObject(value)
    || !hasUniqueId(value.projects)
    || !hasUniqueId(value.tasks)
    || !hasUniqueId(value.members)
    || !value.projects.every(isValidProject)) {
    return false
  }

  const projectIds = new Set(value.projects.map((project) => project.id))
  const memberIds = new Set(value.members.map((member) => member.id))
  return value.tasks.every((task) => isValidTask(task, projectIds, memberIds))
    && validateData(value)
}

const initialData = getInitialData()

export const useProjectStore = create(
  persist(
    (set, get) => ({
      ...initialData,
      hasHydrated: false,

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      addProject: (project) => {
        if (!isValidProject(project) || get().projects.some((item) => item.id === project.id)) return false
        set((state) => ({ projects: [...state.projects, { ...project }] }))
        return true
      },

      updateProject: (projectId, changes) => {
        const current = get().projects.find((project) => project.id === projectId)
        if (!current) return false
        const updated = { ...current, ...changes, id: projectId }
        if (!isValidProject(updated)) return false
        set((state) => ({
          projects: state.projects.map((project) => project.id === projectId ? updated : project),
        }))
        return true
      },

      deleteProject: (projectId) => {
        if (!get().projects.some((project) => project.id === projectId)) return false
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== projectId),
          tasks: state.tasks.filter((task) => task.projectId !== projectId),
        }))
        return true
      },

      addTask: (task) => {
        const state = get()
        if (!isValidTask(task, new Set(state.projects.map((project) => project.id)), new Set(state.members.map((member) => member.id)))
          || state.tasks.some((item) => item.id === task.id)) return false
        set((current) => ({ tasks: [...current.tasks, { ...task }] }))
        return true
      },

      updateTask: (taskId, changes) => {
        const state = get()
        const current = state.tasks.find((task) => task.id === taskId)
        if (!current) return false
        const updated = { ...current, ...changes, id: taskId }
        if (!isValidTask(updated, new Set(state.projects.map((project) => project.id)), new Set(state.members.map((member) => member.id)))) return false
        set((currentState) => ({
          tasks: currentState.tasks.map((task) => task.id === taskId ? updated : task),
        }))
        return true
      },

      deleteTask: (taskId) => {
        if (!get().tasks.some((task) => task.id === taskId)) return false
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) }))
        return true
      },

      updateTaskStatus: (taskId, status) => {
        if (!VALID_STATUSES.includes(status) || !get().tasks.some((task) => task.id === taskId)) return false
        set((state) => ({
          tasks: state.tasks.map((task) => task.id === taskId ? { ...task, status } : task),
        }))
        return true
      },

      resetData: () => set({ ...getInitialData() }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        projects: state.projects,
        tasks: state.tasks,
        members: state.members,
      }),
      merge: (persistedState, currentState) => {
        const candidate = { ...currentState, ...persistedState }
        return isValidStoreState(candidate) ? candidate : currentState
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export { STORAGE_KEY }
