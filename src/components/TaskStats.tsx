import { useTaskContext } from '../hooks/useTaskContext'
import './TaskStats.scss'

export function TaskStats() {
  const { totalCount, completedCount, activeCount } = useTaskContext()

  return (
    <section className="stats" aria-label="Статистика завдань">
      <article className="stat-card">
        <span className="stat-card__value">{totalCount}</span>
        <span className="stat-card__label">Усього</span>
      </article>
      <article className="stat-card stat-card--success">
        <span className="stat-card__value">{completedCount}</span>
        <span className="stat-card__label">Виконано</span>
      </article>
      <article className="stat-card stat-card--warning">
        <span className="stat-card__value">{activeCount}</span>
        <span className="stat-card__label">Залишилося</span>
      </article>
    </section>
  )
}
