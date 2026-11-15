import { useState, type FormEvent } from 'react'
import { useTaskContext } from '../hooks/useTaskContext'
import type { Priority, Task } from '../types/task'
import './TaskForm.scss'

interface TaskFormProps {
  editingTask: Task | null
  onFinishEditing: () => void
}

export function TaskForm({ editingTask, onFinishEditing }: TaskFormProps) {
  const { addTask, updateTask } = useTaskContext()
  const [title, setTitle] = useState(editingTask?.title ?? '')
  const [description, setDescription] = useState(editingTask?.description ?? '')
  const [category, setCategory] = useState(editingTask?.category ?? '')
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'medium')
  const [error, setError] = useState('')

  const clearForm = () => {
    setTitle('')
    setDescription('')
    setCategory('')
    setPriority('medium')
    setError('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) {
      setError('Вкажіть назву завдання')
      return
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'Інше',
      priority,
    }

    if (editingTask === null) {
      addTask(taskData)
    } else {
      updateTask(editingTask.id, taskData)
      onFinishEditing()
    }

    clearForm()
  }

  const cancelEditing = () => {
    clearForm()
    onFinishEditing()
  }

  return (
    <section className="panel task-form">
      <div className="section-heading">
        <h2 className="section-heading__title">
          {editingTask === null ? 'Нове завдання' : 'Редагування завдання'}
        </h2>
        <span className="section-heading__badge">
          {editingTask === null ? 'Додати' : 'Змінити'}
        </span>
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
            placeholder="Наприклад, вивчити useReducer"
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

        <div className="task-form__actions">
          <button className="button button--primary" type="submit">
            {editingTask === null ? '+ Додати завдання' : 'Зберегти зміни'}
          </button>
          {editingTask !== null && (
            <button className="button button--secondary" type="button" onClick={cancelEditing}>
              Скасувати
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
