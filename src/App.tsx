import { useCallback, useEffect, useMemo, useState } from 'react'
import { isAbortError } from './api/httpClient'
import { TaskDetails } from './components/TaskDetails'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { taskRepository } from './repositories/taskRepository'
import type { Task, TaskDraft } from './types/task'
import './App.scss'

const PAGE_SIZE = 10
type Filter = 'all' | 'active' | 'completed'
interface PendingDelete { task: Task; index: number }

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [retry, setRetry] = useState(0)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [confirmTask, setConfirmTask] = useState<Task | null>(null)
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)

  const showNotice = (text: string) => {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 2500)
  }

  const load = useCallback(
    (signal: AbortSignal) => taskRepository.getAll(PAGE_SIZE, (page - 1) * PAGE_SIZE, signal),
    [page],
  )

  useEffect(() => {
    const controller = new AbortController()
    queueMicrotask(() => {
      if (!controller.signal.aborted) {
        setLoading(true)
        setError('')
      }
    })
    load(controller.signal)
      .then((data) => { setTasks(data.tasks); setTotal(data.total) })
      .catch((requestError: unknown) => {
        if (!isAbortError(requestError)) setError(requestError instanceof Error ? requestError.message : 'Помилка завантаження')
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [load, retry])

  useEffect(() => {
    if (!pendingDelete) return
    const timer = window.setTimeout(async () => {
      const deleted = pendingDelete
      setPendingDelete(null)
      try {
        await taskRepository.delete(deleted.task.id)
      } catch (deleteError) {
        setTasks((items) => {
          const restored = [...items]
          restored.splice(deleted.index, 0, deleted.task)
          return restored
        })
        setTotal((value) => value + 1)
        setError(deleteError instanceof Error ? deleteError.message : 'Не вдалося видалити')
      }
    }, 5000)
    return () => window.clearTimeout(timer)
  }, [pendingDelete])

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    if (filter === 'completed') return task.completed
    if (filter === 'active') return !task.completed
    return true
  }), [tasks, filter])

  const completedOnPage = tasks.filter((task) => task.completed).length
  const activeOnPage = tasks.length - completedOnPage
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const createTask = async (draft: TaskDraft) => {
    try {
      const task = await taskRepository.create(draft)
      setTasks((items) => [task, ...items].slice(0, PAGE_SIZE))
      setTotal((value) => value + 1)
      showNotice('Завдання успішно створено')
    } catch (createError) { setError(createError instanceof Error ? createError.message : 'Не вдалося створити') }
  }

  const toggleTask = async (task: Task) => {
    setBusyId(task.id)
    try {
      await taskRepository.update(task.id, { completed: !task.completed })
      setTasks((items) => items.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item))
      showNotice('Статус оновлено')
    } catch (updateError) { setError(updateError instanceof Error ? updateError.message : 'Не вдалося оновити') }
    finally { setBusyId(null) }
  }

  const renameTask = async (task: Task, title: string) => {
    setBusyId(task.id)
    try {
      await taskRepository.update(task.id, { title })
      setTasks((items) => items.map((item) => item.id === task.id ? { ...item, title } : item))
      showNotice('Назву змінено')
    } catch (updateError) { setError(updateError instanceof Error ? updateError.message : 'Не вдалося оновити') }
    finally { setBusyId(null) }
  }

  const startDelete = (task: Task) => {
    if (!pendingDelete) setConfirmTask(task)
  }

  const confirmDelete = () => {
    if (!confirmTask) return
    const index = tasks.findIndex((task) => task.id === confirmTask.id)
    setTasks((items) => items.filter((task) => task.id !== confirmTask.id))
    setTotal((value) => Math.max(0, value - 1))
    setPendingDelete({ task: confirmTask, index })
    setConfirmTask(null)
  }

  const undoDelete = () => {
    if (!pendingDelete) return
    const deleted = pendingDelete
    setPendingDelete(null)
    setTasks((items) => {
      const restored = [...items]
      restored.splice(deleted.index, 0, deleted.task)
      return restored
    })
    setTotal((value) => value + 1)
    showNotice('Видалення скасовано')
  }

  return (
    <div className="app">
      <header className="header"><div><span className="header__eyebrow">Лабораторна №10 · React + REST API</span><h1 className="header__title">Study Planner</h1></div><span className="header__api">DummyJSON API</span></header>
      <main className="app__main">
        {notice && <div className="notice">✓ {notice}</div>}
        <TaskForm disabled={loading} onCreate={createTask} />
        <section className="stats" aria-label="Статистика завдань">
          <article className="stats__item"><span>Усього на сервері</span><strong>{total}</strong></article>
          <article className="stats__item stats__item--active"><span>Активні на сторінці</span><strong>{activeOnPage}</strong></article>
          <article className="stats__item stats__item--completed"><span>Виконані на сторінці</span><strong>{completedOnPage}</strong></article>
        </section>
        <section className="panel planner">
          <div className="planner__header"><div><h2>Завдання із сервера</h2><p>Сторінка {page} із {pages}</p></div><button className="button" onClick={() => setRetry((value) => value + 1)}>Оновити</button></div>
          <div className="filters" role="group" aria-label="Фільтри">
            {(['all', 'active', 'completed'] as const).map((value) => <button key={value} className={`filters__button ${filter === value ? 'filters__button--active' : ''}`} onClick={() => setFilter(value)}>{value === 'all' ? 'Усі' : value === 'active' ? 'Активні' : 'Виконані'}</button>)}
          </div>
          {loading && <div className="status">Завантаження...</div>}
          {!loading && error && <div className="status status--error"><p>Помилка: {error}</p><button className="button" onClick={() => setRetry((value) => value + 1)}>Спробувати ще</button></div>}
          {!loading && !error && visibleTasks.length === 0 && <div className="status">Завдань не знайдено.</div>}
          {!loading && !error && visibleTasks.length > 0 && <TaskList tasks={visibleTasks} busyId={busyId} onDetails={setSelectedId} onToggle={toggleTask} onRename={renameTask} onDelete={startDelete} />}
          <nav className="pagination"><button className="button" disabled={page === 1 || loading} onClick={() => setPage((value) => value - 1)}>← Попередня</button><strong>Сторінка {page} із {pages}</strong><button className="button" disabled={page >= pages || loading} onClick={() => setPage((value) => value + 1)}>Наступна →</button></nav>
        </section>
      </main>
      {selectedId !== null && <TaskDetails taskId={selectedId} onClose={() => setSelectedId(null)} />}
      {confirmTask && <div className="confirm" role="dialog" aria-modal="true"><section className="confirm__card"><span className="confirm__icon">!</span><h2>Видалити завдання?</h2><p>«{confirmTask.title}» буде прибрано зі списку.</p><div className="confirm__actions"><button className="button" onClick={() => setConfirmTask(null)}>Скасувати</button><button className="button button--danger" onClick={confirmDelete}>Видалити</button></div></section></div>}
      {pendingDelete && <aside className="delete-toast"><div className="delete-toast__content"><strong>Завдання видалено</strong><span>Можна скасувати протягом 5 секунд</span></div><button className="delete-toast__undo" onClick={undoDelete}>Скасувати</button><span className="delete-toast__progress" /></aside>}
    </div>
  )
}

export default App
