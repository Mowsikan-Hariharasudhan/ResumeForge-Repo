/*
  # Create Free Downloads System

  1. New Tables
    - `user_free_downloads` - Track free downloads for users
  
  2. Security
    - Enable RLS on `user_free_downloads` table
    - Add policies for users to manage their own free downloads
  
  3. Functions
    - Function to initialize free downloads for new users
    - Function to consume free downloads
*/

-- Create table to track free downloads for users
CREATE TABLE IF NOT EXISTS public.user_free_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  downloads_remaining INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_free_downloads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_free_downloads
CREATE POLICY "Users can view their own free downloads" 
  ON public.user_free_downloads 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own free downloads" 
  ON public.user_free_downloads 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert free downloads for users" 
  ON public.user_free_downloads 
  FOR INSERT 
  WITH CHECK (true);

-- Function to initialize free downloads for new users
CREATE OR REPLACE FUNCTION public.initialize_free_downloads(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_free_downloads (user_id, downloads_remaining)
  VALUES (user_id, 1)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Function to consume a free download
CREATE OR REPLACE FUNCTION public.consume_free_download(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_downloads INTEGER;
BEGIN
  -- Get current downloads remaining
  SELECT downloads_remaining INTO current_downloads
  FROM public.user_free_downloads
  WHERE user_free_downloads.user_id = consume_free_download.user_id;
  
  -- If no record exists or no downloads remaining, return false
  IF current_downloads IS NULL OR current_downloads <= 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Consume one download
  UPDATE public.user_free_downloads
  SET downloads_remaining = downloads_remaining - 1,
      updated_at = now()
  WHERE user_free_downloads.user_id = consume_free_download.user_id;
  
  RETURN TRUE;
END;
$$;

-- Update the handle_new_user function to initialize free downloads
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', '')
  );
  
  -- Initialize free downloads
  PERFORM public.initialize_free_downloads(new.id);
  
  RETURN new;
END;
$$;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_user_free_downloads_user_id 
  ON public.user_free_downloads (user_id);