import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { MediaItem } from '../types/media'

export function useMediaItems() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchMediaItems = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('user_id', user.id)
        .order('date_added', { ascending: false })

      if (error) throw error

      const transformedData: MediaItem[] = data.map(item => ({
        id: item.id,
        title: item.title,
        author: item.creator,
        director: item.creator,
        creator: item.creator,
        type: item.type,
        status: item.status,
        coverUrl: item.cover_url,
        progress: item.progress,
        totalPages: item.total_pages,
        runtime: item.runtime,
        currentSeason: item.current_season,
        currentEpisode: item.current_episode,
        totalSeasons: item.total_seasons,
        totalEpisodes: item.total_episodes,
        genre: item.genre,
        releaseYear: item.release_year,
        rating: item.rating,
        notes: item.notes,
        dateAdded: new Date(item.date_added),
        dateStarted: item.date_started ? new Date(item.date_started) : undefined,
        dateCompleted: item.date_completed ? new Date(item.date_completed) : undefined,
      }))

      setMediaItems(transformedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addMediaItem = async (item: any) => {
    if (!user) return

    try {
      const insertData: any = {
        user_id: user.id,
        title: item.title,
        type: item.type,
        status: item.status,
        cover_url: item.coverUrl,
        notes: item.notes,
        date_added: new Date().toISOString(),
        date_started: item.dateStarted?.toISOString(),
        date_completed: item.dateCompleted?.toISOString(),
      }

      // Set creator based on type
      if (item.type === 'book') {
        insertData.creator = item.author
      } else if (item.type === 'movie') {
        insertData.creator = item.director
      } else {
        insertData.creator = item.creator
      }

      // Set type-specific fields
      if (item.type === 'book') {
        insertData.progress = item.progress
        insertData.total_pages = item.totalPages
      } else if (item.type === 'movie') {
        insertData.runtime = item.runtime
      } else if (item.type === 'tv-show') {
        insertData.current_season = item.currentSeason
        insertData.current_episode = item.currentEpisode
        insertData.total_seasons = item.totalSeasons
        insertData.total_episodes = item.totalEpisodes
      }

      // Add optional fields
      if (item.genre) insertData.genre = item.genre
      if (item.releaseYear) insertData.release_year = item.releaseYear
      if (item.rating) insertData.rating = item.rating

      const { error } = await supabase
        .from('media_items')
        .insert(insertData)

      if (error) throw error
      await fetchMediaItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
      throw err
    }
  }

  const updateMediaItem = async (id: string, updates: Partial<MediaItem>) => {
    if (!user) return

    try {
      // Get the current item to determine its type
      const currentItem = mediaItems.find(item => item.id === id)
      if (!currentItem) throw new Error('Item not found')

      const updateData: any = {
        status: updates.status,
        rating: updates.rating,
        notes: updates.notes,
        date_started: updates.dateStarted?.toISOString(),
        date_completed: updates.dateCompleted?.toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Only include title if provided in updates
      if (updates.title !== undefined) {
        updateData.title = updates.title
      }

      // Handle creator field based on type
      if (currentItem.type === 'book' && (updates as any).author !== undefined) {
        updateData.creator = (updates as any).author
      } else if (currentItem.type === 'movie' && (updates as any).director !== undefined) {
        updateData.creator = (updates as any).director
      } else if (currentItem.type === 'tv-show' && (updates as any).creator !== undefined) {
        updateData.creator = (updates as any).creator
      }

      // Handle type-specific fields
      if (currentItem.type === 'book' && (updates as any).progress !== undefined) {
        updateData.progress = (updates as any).progress
      }

      if (currentItem.type === 'tv-show') {
        if ((updates as any).currentSeason !== undefined) {
          updateData.current_season = (updates as any).currentSeason
        }
        if ((updates as any).currentEpisode !== undefined) {
          updateData.current_episode = (updates as any).currentEpisode
        }
      }

      const { error } = await supabase
        .from('media_items')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchMediaItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item')
      throw err
    }
  }

  const deleteMediaItem = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchMediaItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
      throw err
    }
  }

  useEffect(() => {
    fetchMediaItems()
  }, [user])

  return {
    mediaItems,
    loading,
    error,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,
    refetch: fetchMediaItems,
  }
}