
import { useAuth } from '@/hooks/useAuth';
import { useResumeData } from '@/hooks/useResumeData';
import { useResumeOperations } from '@/hooks/useResumeOperations';
import { useDownloadedResumeOperations } from '@/hooks/useDownloadedResumeOperations';

export const useResumes = () => {
  const { user } = useAuth();
  const { resumes, downloadedResumes, loading, refreshResumes, refreshDownloadedResumes } = useResumeData(user?.id);
  const { saveResume, deleteResume } = useResumeOperations();
  const { saveDownloadedResume, deleteDownloadedResume, loadDownloadedResumeForEditing } = useDownloadedResumeOperations();

  const handleSaveResume = async (resumeData: any, title?: string, resumeId?: string, templateId?: string) => {
    const result = await saveResume(resumeData, title, resumeId, templateId, user?.id);
    if (result) {
      await refreshResumes();
    }
    return result;
  };

  const handleDeleteResume = async (resumeId: string) => {
    await deleteResume(resumeId, user?.id);
    await refreshResumes();
  };

  const handleSaveDownloadedResume = async (resumeData: any, title: string, templateId: string, downloadedResumeId?: string) => {
    const result = await saveDownloadedResume(resumeData, title, templateId, user?.id, downloadedResumeId);
    if (result) {
      await refreshDownloadedResumes();
    }
    return result;
  };

  const handleDeleteDownloadedResume = async (resumeId: string) => {
    await deleteDownloadedResume(resumeId, user?.id);
    await refreshDownloadedResumes();
  };

  return {
    resumes,
    downloadedResumes,
    loading,
    saveResume: handleSaveResume,
    saveDownloadedResume: handleSaveDownloadedResume,
    deleteResume: handleDeleteResume,
    deleteDownloadedResume: handleDeleteDownloadedResume,
    refreshResumes,
    refreshDownloadedResumes,
    loadDownloadedResumeForEditing,
  };
};
