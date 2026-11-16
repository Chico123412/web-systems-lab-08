import { useEffect, useState } from 'react'
import { isAbortError } from '../api/httpClient'
import { taskRepository } from '../repositories/taskRepository'
import type { Task } from '../types/task'
import './TaskDetails.scss'

interface Props { taskId: number; onClose: () => void }

export function TaskDetails({ taskId, onClose }: Props) {
  const [task, setTask] = useState<Task | null>(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    queueMicrotask(() => {
      if (!controller.signal.aborted) {
        setTask(null)
        setError('')
      }
    })
    taskRepository.getById(taskId, controller.signal).then(setTask).catch((e: unknown) => {
      if (!isAbortError(e)) setError(e instanceof Error ? e.message : 'Помилка деталей')
    })
    return () => controller.abort()
  }, [taskId, retry])

  return <div className="modal" role="dialog" aria-modal="true"><section className="modal__card">
    <button className="modal__close" onClick={onClose}>×</button>
    {!task && !error && <p>Завантаження деталей...</p>}
    {error && <div><p className="status status--error">{error}</p><button className="button" onClick={() => setRetry((x) => x + 1)}>Спробувати ще</button></div>}
    {task && <><h2>{task.title}</h2><p>{task.description}</p><dl className="details">
      <dt>Категорія</dt><dd>{task.category}</dd><dt>Пріоритет</dt><dd>{task.priority}</dd><dt>Виконано</dt><dd>{task.completed ? 'Так' : 'Ні'}</dd><dt>User ID</dt><dd>{task.userId}</dd>
    </dl></>}
  </section></div>
}
