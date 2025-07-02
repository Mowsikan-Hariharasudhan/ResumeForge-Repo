
-- Create a table for downloaded resumes (purchased and downloaded PDFs)
CREATE TABLE public.downloaded_resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  resume_data JSONB NOT NULL DEFAULT '{}',
  template_id TEXT DEFAULT 'modern',
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) 
ALTER TABLE public.downloaded_resumes ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own downloaded resumes
CREATE POLICY "Users can view their own downloaded resumes" 
  ON public.downloaded_resumes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own downloaded resumes
CREATE POLICY "Users can insert their own downloaded resumes" 
  ON public.downloaded_resumes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
