import { useCallback, useState, type SetStateAction } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const savedValue = localStorage.getItem(key)
      return savedValue === null ? initialValue : (JSON.parse(savedValue) as T)
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: SetStateAction<T>) => {
      setStoredValue((currentValue) => {
        const nextValue =
          typeof value === 'function'
            ? (value as (previous: T) => T)(currentValue)
            : value

        try {
          localStorage.setItem(key, JSON.stringify(nextValue))
        } catch {
          // The interface remains usable even if browser storage is unavailable.
        }

        return nextValue
      })
    },
    [key],
  )

  return [storedValue, setValue] as const
}
