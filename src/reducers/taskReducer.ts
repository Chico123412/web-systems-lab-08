import type { Task, TaskDraft } from '../types/task'

export interface TaskState {
  tasks: Task[]
  pendingDeleteId: number | null
}

export type TaskAction =
  | { type: 'add'; payload: Task }
  | { type: 'toggle'; payload: { id: number } }
  | { type: 'update'; payload: { id: number; changes: TaskDraft } }
  | { type: 'requestDelete'; payload: { id: number } }
  | { type: 'confirmDelete'; payload: { id: number } }
  | { type: 'undoDelete' }
  | { type: 'reset'; payload: Task[] }

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add':
      return { ...state, tasks: [...state.tasks, action.payload] }

    case 'toggle':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, completed: !task.completed }
            : task,
        ),
      }

    case 'update':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.changes }
            : task,
        ),
      }

    case 'requestDelete':
      return { ...state, pendingDeleteId: action.payload.id }

    case 'confirmDelete':
      return {
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
        pendingDeleteId: null,
      }

    case 'undoDelete':
      return { ...state, pendingDeleteId: null }

    case 'reset':
      return { tasks: action.payload, pendingDeleteId: null }

    default:
      return state
  }
}
