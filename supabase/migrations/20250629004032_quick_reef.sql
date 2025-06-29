/*
  # Add bookmark and share features

  1. Schema Changes
    - Add `is_bookmarked` column to media_items table
    - Add `is_public` column for sharing functionality
    - Add `share_token` column for secure sharing

  2. Security
    - Update RLS policies to handle public sharing
    - Add policy for public access to shared items
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

-- Add policy for public access to shared items
CREATE POLICY IF NOT EXISTS "Public can view shared media items"
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