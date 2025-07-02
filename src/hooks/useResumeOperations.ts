import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ResumeData } from '@/types/resume';

export const useResumeOperations = () => {
  const { toast } = useToast();

  const saveResume = async (resumeData: ResumeData, title?: string, resumeId?: string, templateId?: string, userId?: string) => {
    if (!userId) return null;

    try {
      const payload = {
        user_id: userId,
        title: title || 'Untitled Resume',
        resume_data: resumeData as any,
        template_id: templateId || 'modern',
        updated_at: new Date().toISOString(),
      };

      console.log('Saving resume with payload:', payload);

      let result;
      if (resumeId) {
        const { data, error } = await supabase
          .from('resumes')
          .update(payload)
          .eq('id', resumeId)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        console.log('Resume updated successfully:', result);
      } else {
        const { data, error } = await supabase
          .from('resumes')
          .insert(payload)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        console.log('Resume created successfully:', result);
      }

      // Note: Toast notifications are now handled in the component that calls this function
      // This allows for better control over when to show notifications (manual saves vs auto-saves)

      return result;
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteResume = async (resumeId: string, userId?: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive",
      });
    }
  };

  return {
    saveResume,
    deleteResume,
  };
};