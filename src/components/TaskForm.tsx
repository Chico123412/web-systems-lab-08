import { useState, type FormEvent } from 'react'
import type { Priority, TaskDraft } from '../types/task'
import './TaskForm.scss'

interface Props {
  disabled: boolean
  onCreate: (draft: TaskDraft) => Promise<void>
}

export function TaskForm({ disabled, onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('React')
  const [priority, setPriority] = useState<Priority>('medium')
  const [error, setError] = useState('')

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return setError('Вкажіть назву завдання')
    await onCreate({ title: title.trim(), description, category, priority, userId: 1 })
    setTitle('')
    setDescription('')
    setError('')
  }

  return (
    <section className="panel task-form">
      <h2 className="task-form__title">Нове завдання</h2>
      <form className="task-form__grid" onSubmit={submit}>
        <label className="field">Назва *
          <input value={title} onChange={(e) => { setTitle(e.target.value); setError('') }} />
          {error && <span className="field__error">{error}</span>}
        </label>
        <label className="field">Опис
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="field">Категорія
          <input value={category} onChange={(e) => setCategory(e.target.value)} />
        </label>
        <label className="field">Пріоритет
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option value="low">Низький</option><option value="medium">Середній</option><option value="high">Високий</option>
          </select>
        </label>
        <button className="button button--primary" disabled={disabled}>+ Додати</button>
      </form>
    </section>
  )
}
