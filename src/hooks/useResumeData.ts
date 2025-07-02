
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ResumeData } from '@/types/resume';
import { transformDatabaseResume } from '@/utils/resumeDataUtils';

interface Resume {
  id: string;
  title: string;
  resume_data: ResumeData;
  template_id: string;
  created_at: string;
  updated_at: string;
}

interface DownloadedResume {
  id: string;
  title: string;
  resume_data: ResumeData;
  template_id: string;
  downloaded_at: string;
}

export const useResumeData = (userId?: string) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [downloadedResumes, setDownloadedResumes] = useState<DownloadedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchResumes = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      const typedResumes = (data || []).map(transformDatabaseResume);
      setResumes(typedResumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast({
        title: "Error",
        description: "Failed to load resumes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDownloadedResumes = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('downloaded_resumes')
        .select('*')
        .order('downloaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching downloaded resumes:', error);
        setDownloadedResumes([]);
        return;
      }
      
      const typedDownloadedResumes = (data || []).map(transformDatabaseResume);
      setDownloadedResumes(typedDownloadedResumes);
    } catch (error) {
      console.error('Error fetching downloaded resumes:', error);
      setDownloadedResumes([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchResumes();
      fetchDownloadedResumes();
    }
  }, [userId]);

  return {
    resumes,
    downloadedResumes,
    loading,
    refreshResumes: fetchResumes,
    refreshDownloadedResumes: fetchDownloadedResumes,
  };
};
