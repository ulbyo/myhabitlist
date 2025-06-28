export interface Database {
  public: {
    Tables: {
      media_items: {
        Row: {
          id: string
          user_id: string
          title: string
          creator: string
          type: 'book' | 'movie' | 'tv-show'
          status: 'to-read' | 'reading' | 'completed' | 'to-watch' | 'watching'
          cover_url: string | null
          progress: number | null
          total_pages: number | null
          runtime: number | null
          current_season: number | null
          current_episode: number | null
          total_seasons: number | null
          total_episodes: number | null
          genre: string | null
          release_year: number | null
          rating: number | null
          notes: string | null
          date_added: string
          date_started: string | null
          date_completed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          creator: string
          type: 'book' | 'movie' | 'tv-show'
          status: 'to-read' | 'reading' | 'completed' | 'to-watch' | 'watching'
          cover_url?: string | null
          progress?: number | null
          total_pages?: number | null
          runtime?: number | null
          current_season?: number | null
          current_episode?: number | null
          total_seasons?: number | null
          total_episodes?: number | null
          genre?: string | null
          release_year?: number | null
          rating?: number | null
          notes?: string | null
          date_added: string
          date_started?: string | null
          date_completed?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          creator?: string
          type?: 'book' | 'movie' | 'tv-show'
          status?: 'to-read' | 'reading' | 'completed' | 'to-watch' | 'watching'
          cover_url?: string | null
          progress?: number | null
          total_pages?: number | null
          runtime?: number | null
          current_season?: number | null
          current_episode?: number | null
          total_seasons?: number | null
          total_episodes?: number | null
          genre?: string | null
          release_year?: number | null
          rating?: number | null
          notes?: string | null
          date_added?: string
          date_started?: string | null
          date_completed?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}