import { useState } from 'react'
import './App.css'
import { Header } from './components/Header'
import { TaskFilters } from './components/TaskFilters'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskStats } from './components/TaskStats'
import { initialTasks } from './data/initialTasks'
import type { Task, TaskFilter } from './types/task'

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<TaskFilter>('all')

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    setTasks((currentTasks) => [
      ...currentTasks,
      { ...task, id: Date.now(), completed: false },
    ])
  }

  const toggleTask = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const deleteTask = (id: number) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed
    if (filter === 'active') return !task.completed
    return true
  })

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <TaskForm onAdd={addTask} />
        <TaskStats
          total={tasks.length}
          completed={completedCount}
          active={tasks.length - completedCount}
        />

        <section className="panel tasks-panel">
          <div className="tasks-panel__header">
            <div>
              <p className="tasks-panel__eyebrow">Навчальний план</p>
              <h2 className="section-heading__title">Мої завдання</h2>
            </div>
            <TaskFilters activeFilter={filter} onChange={setFilter} />
          </div>
          <TaskList
            tasks={filteredTasks}
            hasTasks={tasks.length > 0}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </section>
      </main>
    </div>
  )
}

export default App
