export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  priority: Priority
  category: string
}

export type TaskDraft = Omit<Task, 'id' | 'completed'>
export type TaskFilter = 'all' | 'completed' | 'active'
export type ToastType = 'success' | 'warning' | 'error'

export interface ToastMessage {
  id: number
  text: string
  type: ToastType
  undoable?: boolean
  duration?: number
}
