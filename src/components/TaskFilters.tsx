import type { TaskFilter } from '../types/task'

interface TaskFiltersProps {
  activeFilter: TaskFilter
  onChange: (filter: TaskFilter) => void
}

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Усі' },
  { value: 'active', label: 'Не виконані' },
  { value: 'completed', label: 'Виконані' },
]

export function TaskFilters({ activeFilter, onChange }: TaskFiltersProps) {
  return (
    <div className="filters" aria-label="Фільтри завдань">
      {filters.map((filter) => (
        <button
          className={`filters__button ${activeFilter === filter.value ? 'filters__button--active' : ''}`}
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
