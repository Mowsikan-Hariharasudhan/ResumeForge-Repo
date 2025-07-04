import { useAuth } from "@/hooks/useAuth";
import { useResumeData } from "@/hooks/useResumeData";
import { useResumeOperations } from "@/hooks/useResumeOperations";
import { useDownloadedResumeOperations } from "@/hooks/useDownloadedResumeOperations";

export const useResumes = () => {
  const { user } = useAuth();
  const {
    resumes,
    downloadedResumes,
    loading,
    refreshResumes,
    refreshDownloadedResumes,
  } = useResumeData(user?.id);
  const { saveResume, deleteResume } = useResumeOperations();
  const {
    saveDownloadedResume,
    deleteDownloadedResume,
    loadDownloadedResumeForEditing,
  } = useDownloadedResumeOperations();

  const handleSaveResume = async (
    resumeData: any,
    title?: string,
    resumeId?: string,
    templateId?: string,
  ) => {
    const result = await saveResume(
      resumeData,
      title,
      resumeId,
      templateId,
      user?.id,
    );
    if (result) {
      await refreshResumes();
    }
    return result;
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      console.log(
        "useResumes: Starting delete operation for resume:",
        resumeId,
      );
      await deleteResume(resumeId, user?.id);
      console.log(
        "useResumes: Delete operation successful, refreshing list...",
      );
      await refreshResumes();
      console.log("useResumes: Resume list refreshed");
    } catch (error) {
      console.error("useResumes: Delete operation failed:", error);
      throw error; // Re-throw to let component handle it
    }
  };

  const handleSaveDownloadedResume = async (
    resumeData: any,
    title: string,
    templateId: string,
    downloadedResumeId?: string,
  ) => {
    const result = await saveDownloadedResume(
      resumeData,
      title,
      templateId,
      user?.id,
      downloadedResumeId,
    );
    if (result) {
      await refreshDownloadedResumes();
    }
    return result;
  };

  const handleDeleteDownloadedResume = async (resumeId: string) => {
    try {
      console.log(
        "useResumes: Starting delete operation for downloaded resume:",
        resumeId,
      );
      await deleteDownloadedResume(resumeId, user?.id);
      console.log(
        "useResumes: Delete operation successful, refreshing list...",
      );
      await refreshDownloadedResumes();
      console.log("useResumes: Downloaded resume list refreshed");
    } catch (error) {
      console.error(
        "useResumes: Downloaded resume delete operation failed:",
        error,
      );
      throw error; // Re-throw to let component handle it
    }
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
