export const API_URL = 'http://localhost:8081'

export class AuthError extends Error {
  constructor() {
    super('La sesión no es válida')
    this.name = 'AuthError'
  }
}

export function getToken() {
  return localStorage.getItem('token')
}

export function getUserIdFromToken(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload)).userId ?? null
  } catch {
    return null
  }
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const token = getToken()

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 || res.status === 403) throw new AuthError()
  return res
}
