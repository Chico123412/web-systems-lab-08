import { useTaskContext } from '../hooks/useTaskContext'
import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'
import './TaskList.scss'

interface TaskListProps {
  onEdit: (task: Task) => void
}

export function TaskList({ onEdit }: TaskListProps) {
  const { filteredTasks, tasks } = useTaskContext()

  if (filteredTasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon">✓</span>
        <h3 className="empty-state__title">
          {tasks.length > 0 ? 'За цим фільтром завдань немає' : 'Завдань поки немає'}
        </h3>
        {tasks.length === 0 && (
          <p className="empty-state__text">Додайте перше навчальне завдання.</p>
        )}
      </div>
    )
  }

  return (
    <div className="task-list">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEdit} />
      ))}
    </div>
  )
}
