/*
  # Add bookmark and share features to media items

  1. New Columns
    - `is_bookmarked` (boolean) - Flag for bookmarked items
    - `is_public` (boolean) - Flag for publicly shared items
    - `share_token` (text, unique) - Unique token for sharing

  2. Indexes
    - Index for bookmarked items lookup
    - Index for public items lookup

  3. Security
    - Policy for public access to shared items
    - Function to generate secure share tokens

  4. Changes
    - Add bookmark functionality
    - Add sharing functionality with secure tokens
*/

-- Add new columns to media_items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'media_items' AND column_name = 'is_bookmarked'
  ) THEN
    ALTER TABLE media_items ADD COLUMN is_bookmarked boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'media_items' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE media_items ADD COLUMN is_public boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'media_items' AND column_name = 'share_token'
  ) THEN
    ALTER TABLE media_items ADD COLUMN share_token text UNIQUE;
  END IF;
END $$;

-- Create index for bookmarked items
CREATE INDEX IF NOT EXISTS idx_media_items_bookmarked ON media_items(user_id, is_bookmarked) WHERE is_bookmarked = true;

-- Create index for public items
CREATE INDEX IF NOT EXISTS idx_media_items_public ON media_items(is_public, share_token) WHERE is_public = true;

-- Drop existing policy if it exists and create new one
DO $$
BEGIN
  -- Drop the policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'media_items' 
    AND policyname = 'Public can view shared media items'
  ) THEN
    DROP POLICY "Public can view shared media items" ON media_items;
  END IF;
END $$;

-- Add policy for public access to shared items
CREATE POLICY "Public can view shared media items"
  ON media_items
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true AND share_token IS NOT NULL);

-- Function to generate share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS text AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'base64url');
END;
$$ LANGUAGE plpgsql;