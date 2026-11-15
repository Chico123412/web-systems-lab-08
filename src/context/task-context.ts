import { createContext } from 'react'
import type {
  Task,
  TaskDraft,
  TaskFilter,
  ToastMessage,
} from '../types/task'

export interface TaskContextValue {
  tasks: Task[]
  filteredTasks: Task[]
  filter: TaskFilter
  pendingDeleteId: number | null
  totalCount: number
  completedCount: number
  activeCount: number
  toast: ToastMessage | null
  setFilter: (filter: TaskFilter) => void
  addTask: (task: TaskDraft) => void
  updateTask: (id: number, changes: TaskDraft) => void
  toggleTask: (id: number) => void
  requestDelete: (id: number) => void
  undoDelete: () => void
  resetTasks: () => void
  closeToast: () => void
}

export const TaskContext = createContext<TaskContextValue | undefined>(undefined)
