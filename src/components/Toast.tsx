import { useTaskContext } from '../hooks/useTaskContext'
import './Toast.scss'

export function Toast() {
  const { toast, undoDelete, closeToast } = useTaskContext()

  if (toast === null) return null

  return (
    <div className={`toast toast--${toast.type}`} role="status">
      <div className="toast__content">
        <span className="toast__message">{toast.text}</span>
        {toast.undoable ? (
          <button className="toast__action" type="button" onClick={undoDelete}>
            Скасувати
          </button>
        ) : (
          <button className="toast__close" type="button" onClick={closeToast} aria-label="Закрити">
            ×
          </button>
        )}
      </div>
      {toast.undoable && (
        <span
          key={toast.id}
          className="toast__progress"
          style={{ animationDuration: `${toast.duration ?? 5000}ms` }}
        />
      )}
    </div>
  )
}
