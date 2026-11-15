import { useTaskContext } from '../hooks/useTaskContext'
import type { TaskFilter } from '../types/task'
import './TaskFilters.scss'

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Усі' },
  { value: 'active', label: 'Не виконані' },
  { value: 'completed', label: 'Виконані' },
]

export function TaskFilters() {
  const { filter: activeFilter, setFilter } = useTaskContext()

  return (
    <div className="filters" aria-label="Фільтри завдань">
      {filters.map((filter) => (
        <button
          className={`filters__button ${activeFilter === filter.value ? 'filters__button--active' : ''}`}
          key={filter.value}
          type="button"
          onClick={() => setFilter(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
