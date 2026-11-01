import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  hasTasks: boolean
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TaskList({ tasks, hasTasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon">✓</span>
        <h3 className="empty-state__title">
          {hasTasks ? 'За цим фільтром завдань немає' : 'Завдань поки немає'}
        </h3>
        {!hasTasks && <p className="empty-state__text">Додайте перше навчальне завдання.</p>}
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  )
}
