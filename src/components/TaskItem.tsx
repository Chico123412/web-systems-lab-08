import type { Task } from '../types/task'

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

const priorityLabels = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <article className={`task ${task.completed ? 'task--completed' : ''}`}>
      <button
        className={`task__check ${task.completed ? 'task__check--checked' : ''}`}
        type="button"
        onClick={() => onToggle(task.id)}
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
        </div>
        <p className="task__description">{task.description || 'Без опису'}</p>
        <span className="task__category">{task.category}</span>
      </div>

      <button className="button button--danger" type="button" onClick={() => onDelete(task.id)}>
        Видалити
      </button>
    </article>
  )
}
