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

  const addMediaItem = async (item: Omit<MediaItem, 'id' | 'dateAdded'>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('media_items')
        .insert({
          user_id: user.id,
          title: item.title,
          creator: item.type === 'book' ? item.author! : 
                  item.type === 'movie' ? item.director! : item.creator!,
          type: item.type,
          status: item.status,
          cover_url: item.coverUrl,
          progress: item.progress,
          total_pages: item.totalPages,
          runtime: item.runtime,
          current_season: item.currentSeason,
          current_episode: item.currentEpisode,
          total_seasons: item.totalSeasons,
          total_episodes: item.totalEpisodes,
          genre: item.genre,
          release_year: item.releaseYear,
          rating: item.rating,
          notes: item.notes,
          date_added: new Date().toISOString(),
          date_started: item.dateStarted?.toISOString(),
          date_completed: item.dateCompleted?.toISOString(),
        })

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
        progress: updates.progress,
        current_season: updates.currentSeason,
        current_episode: updates.currentEpisode,
        rating: updates.rating,
        notes: updates.notes,
        date_started: updates.dateStarted?.toISOString(),
        date_completed: updates.dateCompleted?.toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Only include title and creator if they are provided in updates
      if (updates.title !== undefined) {
        updateData.title = updates.title
      }

      if (updates.author !== undefined || updates.director !== undefined || updates.creator !== undefined) {
        updateData.creator = currentItem.type === 'book' ? updates.author : 
                            currentItem.type === 'movie' ? updates.director : updates.creator
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