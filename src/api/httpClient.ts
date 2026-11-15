const API_URL = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com'

type RequestOptions = RequestInit & { signal?: AbortSignal }

export async function httpClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText || 'Помилка запиту'}`)
  }

  return response.json() as Promise<T>
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}
