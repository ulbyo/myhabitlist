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
          is_bookmarked: boolean | null
          is_public: boolean | null
          share_token: string | null
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
          is_bookmarked?: boolean | null
          is_public?: boolean | null
          share_token?: string | null
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
          is_bookmarked?: boolean | null
          is_public?: boolean | null
          share_token?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_share_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}