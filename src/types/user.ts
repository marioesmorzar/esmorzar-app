export interface Profile {
  id: string
  username: string
  language: 'es' | 'ca'
  total_esmorzars: number
  total_bars: number
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface User extends Profile {
  email?: string
}
