import { useTaskContext } from '../hooks/useTaskContext'
import type { Task } from '../types/task'
import './TaskItem.scss'

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
}

const priorityLabels = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { toggleTask, requestDelete, pendingDeleteId } = useTaskContext()
  const isPendingDelete = pendingDeleteId === task.id

  return (
    <article
      className={`task ${task.completed ? 'task--completed' : ''} ${isPendingDelete ? 'task--pending' : ''}`}
    >
      <button
        className={`task__check ${task.completed ? 'task__check--checked' : ''}`}
        type="button"
        onClick={() => toggleTask(task.id)}
        disabled={isPendingDelete}
        aria-label={task.completed ? 'Позначити невиконаним' : 'Позначити виконаним'}
      >
        {task.completed ? '✓' : ''}
      </button>

      <div className="task__content">
        <div className="task__top">
          <h3 className="task__title">{task.title}</h3>
          <span className={`priority priority--${task.priority}`}>
            {priorityLabels[task.priority]}
          </span>
          {isPendingDelete && <span className="task__pending-label">Буде видалено</span>}
        </div>
        <p className="task__description">{task.description || 'Без опису'}</p>
        <span className="task__category">{task.category}</span>
      </div>

      <div className="task__actions">
        <button
          className="button button--secondary"
          type="button"
          onClick={() => onEdit(task)}
          disabled={isPendingDelete}
        >
          Редагувати
        </button>
        <button
          className="button button--danger"
          type="button"
          onClick={() => requestDelete(task.id)}
          disabled={isPendingDelete}
        >
          Видалити
        </button>
      </div>
    </article>
  )
}
