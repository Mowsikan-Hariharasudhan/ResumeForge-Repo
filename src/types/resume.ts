
export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  achievements: string[];
  experience: Array<{
    position: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    grade: string;
  }>;
  skills: string[];
  languages: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
}
