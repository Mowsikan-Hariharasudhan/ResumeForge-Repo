
import { ResumeData } from '@/types/resume';

export const ensureResumeDataCompatibility = (resumeData: unknown): ResumeData => {
  const data = resumeData as ResumeData;
  return {
    ...data,
    achievements: data?.achievements || []
  };
};

export const transformDatabaseResume = (resume: any) => ({
  ...resume,
  resume_data: ensureResumeDataCompatibility(resume.resume_data)
});
