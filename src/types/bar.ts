export interface Bar {
  id: string
  name: string
  municipality: string
  province: string
  created_at: string
  created_by?: string | null
}

export interface BarWithLocation extends Bar {
  location: string // "municipality, province"
}

