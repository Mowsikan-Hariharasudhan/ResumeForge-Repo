import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useResumes } from "@/hooks/useResumes";

interface ResumeEditLoaderProps {
  onLoadResume: (data: any) => void;
}

export const ResumeEditLoader = ({ onLoadResume }: ResumeEditLoaderProps) => {
  const [searchParams] = useSearchParams();
  const { resumes, downloadedResumes, loadDownloadedResumeForEditing } =
    useResumes();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resumeId = searchParams.get("resume");
    const downloadedId = searchParams.get("downloaded");

    console.log(
      "ResumeEditLoader - resumeId:",
      resumeId,
      "downloadedId:",
      downloadedId,
    );
    console.log("Available resumes:", resumes);
    console.log("Available downloaded resumes:", downloadedResumes);

    if (resumeId && resumes.length > 0) {
      const resume = resumes.find((r) => r.id === resumeId);
      console.log("Found saved resume:", resume);

      if (resume) {
        onLoadResume({
          resumeData: resume.resume_data,
          title: resume.title,
          templateId: resume.template_id,
          resumeId: resume.id,
          isFromDownloaded: false,
        });
      }
      setIsLoading(false);
    } else if (downloadedId && downloadedResumes.length > 0) {
      const downloadedResume = downloadedResumes.find(
        (r) => r.id === downloadedId,
      );
      console.log("Found downloaded resume:", downloadedResume);

      if (downloadedResume) {
        const loadedData = loadDownloadedResumeForEditing(downloadedResume);
        onLoadResume(loadedData);
      }
      setIsLoading(false);
    } else if (!resumeId && !downloadedId) {
      setIsLoading(false);
    }
  }, [searchParams, resumes, downloadedResumes, onLoadResume]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading resume...</span>
      </div>
    );
  }

  return null;
};
