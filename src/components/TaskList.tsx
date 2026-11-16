import { useState } from 'react'
import type { Task } from '../types/task'
import './TaskList.scss'

interface Props {
  tasks: Task[]
  busyId: number | null
  onDetails: (id: number) => void
  onToggle: (task: Task) => void
  onRename: (task: Task, title: string) => void
  onDelete: (task: Task) => void
}

export function TaskList({ tasks, busyId, onDetails, onToggle, onRename, onDelete }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState('')

  const startEditing = (task: Task) => { setEditingId(task.id); setTitle(task.title) }
  const save = (task: Task) => {
    if (title.trim() && title.trim() !== task.title) onRename(task, title.trim())
    setEditingId(null)
  }

  return <div className="task-list">{tasks.map((task) => <article className={`task ${task.completed ? 'task--completed' : ''}`} key={task.id}>
    <input aria-label="Виконано" type="checkbox" checked={task.completed} disabled={busyId === task.id} onChange={() => onToggle(task)} />
    <div className="task__body">
      {editingId === task.id ? <input className="task__edit" value={title} autoFocus onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') save(task); if (event.key === 'Escape') setEditingId(null) }} /> : <h3 className="task__title">{task.title}</h3>}
      <span className="task__meta">#{task.id} · {task.category} · {task.priority}</span>
    </div>
    <div className="task__actions">
      <button onClick={() => onDetails(task.id)}>Деталі</button>
      {editingId === task.id ? <button onClick={() => save(task)}>Зберегти</button> : <button onClick={() => startEditing(task)}>Назва</button>}
      <button className="task__delete" onClick={() => onDelete(task)}>Видалити</button>
    </div>
  </article>)}</div>
}
