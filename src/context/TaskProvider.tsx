import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import { initialTasks } from '../data/initialTasks'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { taskReducer, type TaskState } from '../reducers/taskReducer'
import type {
  Task,
  TaskDraft,
  TaskFilter,
  ToastMessage,
  ToastType,
} from '../types/task'
import { TaskContext, type TaskContextValue } from './task-context'

const TASKS_STORAGE_KEY = 'study-planner-tasks'
const FILTER_STORAGE_KEY = 'study-planner-filter'
const DELETE_DELAY = 5000

interface TaskProviderProps {
  children: ReactNode
}

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false

  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'number' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    typeof task.completed === 'boolean' &&
    ['low', 'medium', 'high'].includes(String(task.priority)) &&
    typeof task.category === 'string'
  )
}

function createInitialState(): TaskState {
  try {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (savedTasks !== null) {
      const parsedTasks: unknown = JSON.parse(savedTasks)
      if (Array.isArray(parsedTasks) && parsedTasks.every(isTask)) {
        return { tasks: parsedTasks, pendingDeleteId: null }
      }
    }
  } catch {
    // Damaged storage falls back to the initial list.
  }

  return { tasks: initialTasks.map((task) => ({ ...task })), pendingDeleteId: null }
}

function isTaskFilter(value: unknown): value is TaskFilter {
  return value === 'all' || value === 'active' || value === 'completed'
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, undefined, createInitialState)
  const [savedFilter, saveFilter] = useLocalStorage<TaskFilter>(
    FILTER_STORAGE_KEY,
    'all',
  )
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const filter: TaskFilter = isTaskFilter(savedFilter) ? savedFilter : 'all'

  const showToast = useCallback(
    (
      text: string,
      type: ToastType,
      undoable = false,
      duration = 3000,
    ) => {
      setToast({ id: Date.now(), text, type, undoable, duration })
    },
    [],
  )

  const addTask = useCallback(
    (task: TaskDraft) => {
      dispatch({
        type: 'add',
        payload: { ...task, id: Date.now(), completed: false },
      })
      showToast('Завдання успішно створено', 'success')
    },
    [showToast],
  )

  const updateTask = useCallback(
    (id: number, changes: TaskDraft) => {
      dispatch({ type: 'update', payload: { id, changes } })
      showToast('Завдання успішно оновлено', 'success')
    },
    [showToast],
  )

  const toggleTask = useCallback((id: number) => {
    dispatch({ type: 'toggle', payload: { id } })
  }, [])

  const requestDelete = useCallback(
    (id: number) => {
      if (state.pendingDeleteId !== null) {
        showToast('Спочатку завершіть поточне видалення', 'error')
        return
      }

      dispatch({ type: 'requestDelete', payload: { id } })
      showToast(
        'Завдання буде видалено через 5 секунд',
        'warning',
        true,
        DELETE_DELAY,
      )
    },
    [showToast, state.pendingDeleteId],
  )

  const undoDelete = useCallback(() => {
    dispatch({ type: 'undoDelete' })
    showToast('Видалення скасовано', 'success')
  }, [showToast])

  const resetTasks = useCallback(() => {
    dispatch({
      type: 'reset',
      payload: initialTasks.map((task) => ({ ...task })),
    })
    saveFilter('all')
    showToast('Початкові дані відновлено', 'success')
  }, [saveFilter, showToast])

  const setFilter = useCallback(
    (nextFilter: TaskFilter) => saveFilter(nextFilter),
    [saveFilter],
  )

  const closeToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(state.tasks))
    } catch {
      // The current state remains available even if storage is blocked.
    }
  }, [state.tasks])

  useEffect(() => {
    if (state.pendingDeleteId === null) return

    const deletingId = state.pendingDeleteId
    const timerId = window.setTimeout(() => {
      dispatch({ type: 'confirmDelete', payload: { id: deletingId } })
      showToast('Завдання остаточно видалено', 'success')
    }, DELETE_DELAY)

    return () => window.clearTimeout(timerId)
  }, [showToast, state.pendingDeleteId])

  const completedCount = state.tasks.filter((task) => task.completed).length
  const activeCount = state.tasks.length - completedCount

  useEffect(() => {
    document.title = `Study Planner — ${activeCount} active tasks`
  }, [activeCount])

  useEffect(() => {
    if (toast === null || toast.undoable) return

    const timerId = window.setTimeout(() => setToast(null), toast.duration ?? 3000)
    return () => window.clearTimeout(timerId)
  }, [toast])

  const filteredTasks = useMemo(
    () =>
      state.tasks.filter((task) => {
        if (filter === 'completed') return task.completed
        if (filter === 'active') return !task.completed
        return true
      }),
    [filter, state.tasks],
  )

  const contextValue = useMemo<TaskContextValue>(
    () => ({
      tasks: state.tasks,
      filteredTasks,
      filter,
      pendingDeleteId: state.pendingDeleteId,
      totalCount: state.tasks.length,
      completedCount,
      activeCount,
      toast,
      setFilter,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      resetTasks,
      closeToast,
    }),
    [
      activeCount,
      addTask,
      closeToast,
      completedCount,
      filter,
      filteredTasks,
      requestDelete,
      resetTasks,
      setFilter,
      state.pendingDeleteId,
      state.tasks,
      toast,
      toggleTask,
      undoDelete,
      updateTask,
    ],
  )

  return <TaskContext value={contextValue}>{children}</TaskContext>
}
