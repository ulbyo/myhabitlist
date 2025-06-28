/*
  # Create media items table

  1. New Tables
    - `media_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `creator` (text) - author/director/creator name
      - `type` (text) - book/movie/tv-show
      - `status` (text) - to-read/reading/completed/to-watch/watching
      - `cover_url` (text, nullable)
      - `progress` (integer, nullable) - reading progress percentage
      - `total_pages` (integer, nullable) - for books
      - `runtime` (integer, nullable) - for movies in minutes
      - `current_season` (integer, nullable) - for TV shows
      - `current_episode` (integer, nullable) - for TV shows
      - `total_seasons` (integer, nullable) - for TV shows
      - `total_episodes` (integer, nullable) - for TV shows
      - `genre` (text, nullable)
      - `release_year` (integer, nullable)
      - `rating` (integer, nullable) - 1-5 stars
      - `notes` (text, nullable)
      - `date_added` (timestamptz)
      - `date_started` (timestamptz, nullable)
      - `date_completed` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `media_items` table
    - Add policies for authenticated users to manage their own media items
*/

CREATE TABLE IF NOT EXISTS media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  creator text NOT NULL,
  type text NOT NULL CHECK (type IN ('book', 'movie', 'tv-show')),
  status text NOT NULL CHECK (status IN ('to-read', 'reading', 'completed', 'to-watch', 'watching')),
  cover_url text,
  progress integer CHECK (progress >= 0 AND progress <= 100),
  total_pages integer CHECK (total_pages > 0),
  runtime integer CHECK (runtime > 0),
  current_season integer CHECK (current_season > 0),
  current_episode integer CHECK (current_episode > 0),
  total_seasons integer CHECK (total_seasons > 0),
  total_episodes integer CHECK (total_episodes > 0),
  genre text,
  release_year integer CHECK (release_year > 1800 AND release_year <= EXTRACT(YEAR FROM NOW()) + 10),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  notes text,
  date_added timestamptz NOT NULL DEFAULT now(),
  date_started timestamptz,
  date_completed timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own media items"
  ON media_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own media items"
  ON media_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media items"
  ON media_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media items"
  ON media_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_items_user_id ON media_items(user_id);
CREATE INDEX IF NOT EXISTS idx_media_items_type ON media_items(type);
CREATE INDEX IF NOT EXISTS idx_media_items_status ON media_items(status);
CREATE INDEX IF NOT EXISTS idx_media_items_date_added ON media_items(date_added);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_media_items_updated_at
  BEFORE UPDATE ON media_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();