import { Bar } from './bar'

export interface Esmorzar {
  id: string
  user_id: string
  bar_id: string
  date: string
  bocadillo?: string | null
  gasto?: string[] | null
  bebida?: string | null
  cafe?: string | null
  price?: number | null
  review?: string | null
  photos?: string[] | null
  created_at: string
  updated_at: string
}

export interface EsmorzarWithBar extends Esmorzar {
  bars?: Bar
}

export interface NewEsmorzarForm {
  bar_id: string
  date: string
  bocadillo?: string
  gasto?: string[]
  bebida?: string
  cafe?: string
  price?: number
  review?: string
  photos?: File[]
}

