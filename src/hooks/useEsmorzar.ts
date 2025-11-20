import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Esmorzar, EsmorzarWithBar, NewEsmorzarForm } from '../types/esmorzar'

export function useEsmorzar(userId: string | undefined) {
  const [esmorzars, setEsmorzars] = useState<EsmorzarWithBar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (userId) {
      fetchEsmorzars()
    } else {
      setLoading(false)
    }
  }, [userId])

  const fetchEsmorzars = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('esmorzars')
        .select(`
          *,
          bars (*)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setEsmorzars(data || [])
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching esmorzars:', err)
    } finally {
      setLoading(false)
    }
  }

  const getEsmorzar = async (id: string): Promise<EsmorzarWithBar | null> => {
    try {
      const { data, error } = await supabase
        .from('esmorzars')
        .select(`
          *,
          bars (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error fetching esmorzar:', err)
      return null
    }
  }

  const createEsmorzar = async (formData: NewEsmorzarForm): Promise<Esmorzar | null> => {
    if (!userId) return null

    try {
      // Subir fotos primero si hay
      let photoUrls: string[] = []
      if (formData.photos && formData.photos.length > 0) {
        photoUrls = await uploadPhotos(formData.photos, userId)
      }

      const { data, error } = await supabase
        .from('esmorzars')
        .insert({
          user_id: userId,
          bar_id: formData.bar_id,
          date: formData.date,
          bocadillo: formData.bocadillo || null,
          gasto: formData.gasto || null,
          bebida: formData.bebida || null,
          cafe: formData.cafe || null,
          price: formData.price || null,
          review: formData.review || null,
          photos: photoUrls.length > 0 ? photoUrls : null,
        })
        .select()
        .single()

      if (error) throw error
      await fetchEsmorzars() // Refrescar lista
      return data
    } catch (err) {
      console.error('Error creating esmorzar:', err)
      throw err
    }
  }

  const updateEsmorzar = async (id: string, formData: Partial<NewEsmorzarForm>): Promise<Esmorzar | null> => {
    try {
      const updateData: any = { ...formData }
      delete updateData.photos

      // Si hay nuevas fotos, subirlas
      if (formData.photos && formData.photos.length > 0) {
        const photoUrls = await uploadPhotos(formData.photos, userId!)
        updateData.photos = photoUrls
      }

      const { data, error } = await supabase
        .from('esmorzars')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchEsmorzars() // Refrescar lista
      return data
    } catch (err) {
      console.error('Error updating esmorzar:', err)
      throw err
    }
  }

  const deleteEsmorzar = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('esmorzars')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchEsmorzars() // Refrescar lista
    } catch (err) {
      console.error('Error deleting esmorzar:', err)
      throw err
    }
  }

  const uploadPhotos = async (photos: File[], userId: string): Promise<string[]> => {
    const urls: string[] = []

    for (const photo of photos) {
      const fileExt = photo.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `esmorzar-photos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('esmorzar-photos')
        .upload(filePath, photo)

      if (uploadError) {
        console.error('Error uploading photo:', uploadError)
        continue
      }

      const { data } = supabase.storage
        .from('esmorzar-photos')
        .getPublicUrl(filePath)

      urls.push(data.publicUrl)
    }

    return urls
  }

  return {
    esmorzars,
    loading,
    error,
    fetchEsmorzars,
    getEsmorzar,
    createEsmorzar,
    updateEsmorzar,
    deleteEsmorzar,
  }
}

