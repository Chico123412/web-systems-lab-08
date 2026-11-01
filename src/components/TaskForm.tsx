import { useState, type FormEvent } from 'react'
import type { Priority, Task } from '../types/task'

interface TaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'completed'>) => void
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) {
      setError('Вкажіть назву завдання')
      return
    }

    onAdd({
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'Інше',
      priority,
    })
    setTitle('')
    setDescription('')
    setCategory('')
    setPriority('medium')
    setError('')
  }

  return (
    <section className="panel task-form">
      <div className="section-heading">
        <h2 className="section-heading__title">Нове завдання</h2>
        <span className="section-heading__badge">Додати</span>
      </div>

      <form className="task-form__form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Назва *</span>
          <input
            className={`field__control ${error ? 'field__control--error' : ''}`}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              setError('')
            }}
            placeholder="Наприклад, вивчити useState"
          />
          {error && <span className="field__error">{error}</span>}
        </label>

        <label className="field field--wide">
          <span className="field__label">Опис</span>
          <textarea
            className="field__control field__control--textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Коротко опишіть завдання"
          />
        </label>

        <label className="field">
          <span className="field__label">Категорія</span>
          <input
            className="field__control"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="React, TypeScript..."
          />
        </label>

        <label className="field">
          <span className="field__label">Пріоритет</span>
          <select
            className="field__control"
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </label>

        <button className="button button--primary task-form__button" type="submit">
          + Додати завдання
        </button>
      </form>
    </section>
  )
}
