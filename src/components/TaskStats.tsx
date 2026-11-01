interface TaskStatsProps {
  total: number
  completed: number
  active: number
}

export function TaskStats({ total, completed, active }: TaskStatsProps) {
  return (
    <section className="stats" aria-label="Статистика завдань">
      <article className="stat-card">
        <span className="stat-card__value">{total}</span>
        <span className="stat-card__label">Усього</span>
      </article>
      <article className="stat-card stat-card--success">
        <span className="stat-card__value">{completed}</span>
        <span className="stat-card__label">Виконано</span>
      </article>
      <article className="stat-card stat-card--warning">
        <span className="stat-card__value">{active}</span>
        <span className="stat-card__label">Залишилося</span>
      </article>
    </section>
  )
}
