import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Bar, BarWithLocation } from '../types/bar'

export function useBars() {
  const [bars, setBars] = useState<BarWithLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchBars()
  }, [])

  const fetchBars = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('bars')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      const barsWithLocation: BarWithLocation[] = (data || []).map((bar) => ({
        ...bar,
        location: `${bar.municipality}, ${bar.province}`,
      }))

      setBars(barsWithLocation)
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching bars:', err)
    } finally {
      setLoading(false)
    }
  }

  const searchBars = async (query: string): Promise<BarWithLocation[]> => {
    try {
      const { data, error } = await supabase
        .from('bars')
        .select('*')
        .or(`name.ilike.%${query}%,municipality.ilike.%${query}%,province.ilike.%${query}%`)
        .order('name', { ascending: true })
        .limit(10)

      if (error) throw error

      return (data || []).map((bar) => ({
        ...bar,
        location: `${bar.municipality}, ${bar.province}`,
      }))
    } catch (err) {
      console.error('Error searching bars:', err)
      return []
    }
  }

  const createBar = async (name: string, municipality: string, province: string, userId: string): Promise<Bar | null> => {
    try {
      const { data, error } = await supabase
        .from('bars')
        .insert({
          name,
          municipality,
          province,
          created_by: userId,
        })
        .select()
        .single()

      if (error) throw error
      await fetchBars() // Refrescar lista
      return data
    } catch (err) {
      console.error('Error creating bar:', err)
      throw err
    }
  }

  return {
    bars,
    loading,
    error,
    fetchBars,
    searchBars,
    createBar,
  }
}

