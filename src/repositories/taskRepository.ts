import { httpClient } from '../api/httpClient'
import type { ApiTodo, Task, TaskDraft, TodosResponse } from '../types/task'

export interface TaskPage {
  tasks: Task[]
  total: number
}

function toTask(todo: ApiTodo): Task {
  return {
    id: todo.id,
    title: todo.todo,
    description: 'Завдання отримано з DummyJSON REST API',
    completed: todo.completed,
    priority: 'medium',
    category: 'Загальне',
    userId: todo.userId,
  }
}

export const taskRepository = {
  async getAll(limit: number, skip: number, signal?: AbortSignal): Promise<TaskPage> {
    const data = await httpClient<TodosResponse>(`/todos?limit=${limit}&skip=${skip}`, { signal })
    return { tasks: data.todos.map(toTask), total: data.total }
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    return toTask(await httpClient<ApiTodo>(`/todos/${id}`, { signal }))
  },

  async create(draft: TaskDraft): Promise<Task> {
    const created = await httpClient<ApiTodo>('/todos/add', {
      method: 'POST',
      body: JSON.stringify({ todo: draft.title, completed: false, userId: draft.userId }),
    })
    return { ...toTask(created), ...draft, completed: false }
  },

  async update(id: number, changes: Partial<Task>): Promise<Partial<Task>> {
    const payload: Partial<ApiTodo> = {}
    if (changes.title !== undefined) payload.todo = changes.title
    if (changes.completed !== undefined) payload.completed = changes.completed
    await httpClient<ApiTodo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    return changes
  },

  async delete(id: number): Promise<void> {
    await httpClient<ApiTodo>(`/todos/${id}`, { method: 'DELETE' })
  },
}
