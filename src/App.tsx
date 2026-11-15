import { useState } from 'react'
import './App.scss'
import { Header } from './components/Header'
import { TaskFilters } from './components/TaskFilters'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskStats } from './components/TaskStats'
import { Toast } from './components/Toast'
import { useTaskContext } from './hooks/useTaskContext'
import type { Task } from './types/task'

function App() {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { resetTasks } = useTaskContext()

  const handleReset = () => {
    setEditingTask(null)
    resetTasks()
  }

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <TaskForm
          key={editingTask?.id ?? 'new-task'}
          editingTask={editingTask}
          onFinishEditing={() => setEditingTask(null)}
        />
        <TaskStats />

        <section className="panel tasks-panel">
          <div className="tasks-panel__header">
            <div>
              <p className="tasks-panel__eyebrow">Навчальний план</p>
              <h2 className="section-heading__title">Мої завдання</h2>
            </div>
            <div className="tasks-panel__controls">
              <TaskFilters />
              <button className="button button--secondary" type="button" onClick={handleReset}>
                Скинути дані
              </button>
            </div>
          </div>
          <TaskList onEdit={setEditingTask} />
        </section>
      </main>
      <Toast />
    </div>
  )
}

export default App
