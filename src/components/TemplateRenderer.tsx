import React from "react";
import { ResumeData } from "@/types/resume";

interface TemplateRendererProps {
  templateId: string;
  resumeData?: ResumeData;
  className?: string;
}

// Default resume data for preview
const defaultResumeData: ResumeData = {
  fullName: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  website: "https://sarahjohnson.dev",
  linkedin: "https://linkedin.com/in/sarahjohnson",
  github: "https://github.com/sarahjohnson",
  summary:
    "Results-driven professional with 5+ years of experience delivering exceptional outcomes in fast-paced environments.",
  achievements: [
    "Increased team productivity by 40% through process optimization",
    "Led cross-functional projects with budgets exceeding $1M",
    "Mentored 10+ junior team members to career advancement",
  ],
  experience: [
    {
      position: "Senior Product Manager",
      company: "Tech Innovation Corp",
      duration: "2022 - Present",
      description:
        "Lead product strategy and development for flagship products serving 100K+ users.",
    },
    {
      position: "Product Manager",
      company: "Growth Solutions Inc",
      duration: "2020 - 2022",
      description:
        "Managed product roadmap and cross-functional teams to deliver key features.",
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "Stanford University",
      year: "2020",
      grade: "3.8 GPA",
    },
  ],
  skills: [
    "Product Strategy",
    "Data Analysis",
    "Team Leadership",
    "Agile Development",
    "User Research",
  ],
  languages: ["English (Native)", "Spanish (Conversational)"],
  certifications: [
    {
      name: "Product Management Certificate",
      issuer: "Stanford University",
      year: "2023",
    },
  ],
  projects: [
    {
      name: "Mobile App Redesign",
      description:
        "Led complete redesign of mobile application increasing user engagement by 60%",
      technologies: "React Native, Figma, Analytics",
      link: "https://example.com",
    },
  ],
};

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  templateId,
  resumeData = defaultResumeData,
  className = "",
}) => {
  const renderTemplate = () => {
    switch (templateId) {
      case "modern-classic":
        return <ModernClassicTemplate data={resumeData} />;
      case "creative-bold":
        return <CreativeBoldTemplate data={resumeData} />;
      case "minimal-clean":
        return <MinimalCleanTemplate data={resumeData} />;
      case "executive-elite":
        return <ExecutiveEliteTemplate data={resumeData} />;
      case "tech-developer":
        return <TechDeveloperTemplate data={resumeData} />;
      case "academic-scholar":
        return <AcademicScholarTemplate data={resumeData} />;
      case "healthcare-pro":
        return <HealthcareProTemplate data={resumeData} />;
      case "sales-achiever":
        return <SalesAchieverTemplate data={resumeData} />;
      case "consultant-expert":
        return <ConsultantExpertTemplate data={resumeData} />;
      case "startup-innovator":
        return <StartupInnovatorTemplate data={resumeData} />;
      default:
        return <ModernClassicTemplate data={resumeData} />;
    }
  };

  return (
    <div className={`w-full h-full bg-white overflow-hidden ${className}`}>
      {renderTemplate()}
    </div>
  );
};

// Template 1: Modern Classic
const ModernClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full p-6 text-xs font-sans bg-white">
    <div className="border-b-2 border-blue-600 pb-4 mb-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.fullName}</h1>
      <div className="text-blue-600 font-medium mb-2">
        {data.experience[0]?.position}
      </div>
      <div className="text-gray-600 space-y-1">
        <div>
          {data.email} | {data.phone}
        </div>
        <div>{data.location}</div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <section>
          <h2 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </section>

        <section>
          <h2 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">
            Experience
          </h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <span className="text-gray-600 text-xs">{exp.duration}</span>
              </div>
              <div className="text-blue-600 font-medium text-xs mb-1">
                {exp.company}
              </div>
              <p className="text-gray-700 text-xs leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </section>
      </div>

      <div className="space-y-4">
        <section>
          <h2 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">
            Skills
          </h2>
          <div className="space-y-1">
            {data.skills.map((skill, idx) => (
              <div key={idx} className="text-gray-700 text-xs">
                • {skill}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">
            Education
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-semibold text-gray-900 text-xs">
                {edu.degree}
              </div>
              <div className="text-gray-600 text-xs">{edu.school}</div>
              <div className="text-gray-600 text-xs">{edu.year}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
);

// Template 2: Creative Bold
const CreativeBoldTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50">
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
      <h1 className="text-2xl font-bold mb-1">{data.fullName}</h1>
      <div className="text-purple-100 font-medium mb-2">
        {data.experience[0]?.position}
      </div>
      <div className="text-purple-200 text-xs space-y-1">
        <div>
          {data.email} | {data.phone}
        </div>
        <div>{data.location}</div>
      </div>
    </div>

    <div className="p-6 space-y-4">
      <section>
        <h2 className="text-lg font-bold text-purple-700 mb-2 relative">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            About Me
          </span>
          <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></div>
        </h2>
        <p className="text-gray-700 text-xs leading-relaxed">{data.summary}</p>
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-bold text-purple-700 mb-3 relative">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Experience
            </span>
            <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></div>
          </h2>
          {data.experience.map((exp, idx) => (
            <div
              key={idx}
              className="mb-4 bg-white p-3 rounded-lg shadow-sm border-l-4 border-purple-400"
            >
              <h3 className="font-bold text-gray-900 text-xs">
                {exp.position}
              </h3>
              <div className="text-purple-600 font-medium text-xs mb-1">
                {exp.company}
              </div>
              <div className="text-gray-500 text-xs mb-2">{exp.duration}</div>
              <p className="text-gray-700 text-xs leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </section>

        <div className="space-y-4">
          <section>
            <h2 className="text-lg font-bold text-purple-700 mb-3 relative">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Skills
              </span>
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></div>
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-purple-700 mb-3 relative">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Education
              </span>
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></div>
            </h2>
            {data.education.map((edu, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="font-bold text-gray-900 text-xs">
                  {edu.degree}
                </div>
                <div className="text-purple-600 text-xs">{edu.school}</div>
                <div className="text-gray-500 text-xs">{edu.year}</div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  </div>
);

// Template 3: Minimal Clean
const MinimalCleanTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full p-8 text-xs font-light bg-white">
    <div className="text-center mb-8 border-b border-gray-200 pb-6">
      <h1 className="text-3xl font-thin text-gray-900 mb-2 tracking-wide">
        {data.fullName}
      </h1>
      <div className="text-gray-600 mb-2">{data.experience[0]?.position}</div>
      <div className="text-gray-500 space-x-2">
        <span>{data.email}</span>
        <span>•</span>
        <span>{data.phone}</span>
        <span>•</span>
        <span>{data.location}</span>
      </div>
    </div>

    <div className="space-y-6">
      <section>
        <p className="text-gray-700 leading-relaxed text-center italic">
          {data.summary}
        </p>
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-widest uppercase">
          Experience
        </h2>
        {data.experience.map((exp, idx) => (
          <div key={idx} className="mb-6">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-medium text-gray-900">{exp.position}</h3>
              <span className="text-gray-500 text-xs">{exp.duration}</span>
            </div>
            <div className="text-gray-600 text-xs mb-2">{exp.company}</div>
            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-widest uppercase">
            Skills
          </h2>
          <div className="space-y-1">
            {data.skills.map((skill, idx) => (
              <div key={idx} className="text-gray-700">
                {skill}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-widest uppercase">
            Education
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="font-medium text-gray-900">{edu.degree}</div>
              <div className="text-gray-600">{edu.school}</div>
              <div className="text-gray-500 text-xs">{edu.year}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
);

// Template 4: Executive Elite
const ExecutiveEliteTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-white">
    <div className="bg-gray-900 text-white p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1 tracking-wide">
          {data.fullName}
        </h1>
        <div className="text-gray-300 font-medium mb-2">
          {data.experience[0]?.position}
        </div>
        <div className="text-gray-400 text-xs space-x-2">
          <span>{data.email}</span>
          <span>|</span>
          <span>{data.phone}</span>
          <span>|</span>
          <span>{data.location}</span>
        </div>
      </div>
    </div>

    <div className="p-6 space-y-5">
      <section>
        <h2 className="text-sm font-bold text-gray-900 mb-3 pb-1 border-b-2 border-gray-900 uppercase tracking-wide">
          Executive Summary
        </h2>
        <p className="text-gray-700 text-xs leading-relaxed">{data.summary}</p>
      </section>

      <section>
        <h2 className="text-sm font-bold text-gray-900 mb-3 pb-1 border-b-2 border-gray-900 uppercase tracking-wide">
          Professional Experience
        </h2>
        {data.experience.map((exp, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-gray-900 text-xs">
                {exp.position}
              </h3>
              <span className="text-gray-600 text-xs font-medium">
                {exp.duration}
              </span>
            </div>
            <div className="text-gray-700 font-medium text-xs mb-2">
              {exp.company}
            </div>
            <p className="text-gray-700 text-xs leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-bold text-gray-900 mb-3 pb-1 border-b-2 border-gray-900 uppercase tracking-wide">
            Core Competencies
          </h2>
          <div className="grid grid-cols-1 gap-1">
            {data.skills.map((skill, idx) => (
              <div key={idx} className="text-gray-700 text-xs">
                • {skill}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-gray-900 mb-3 pb-1 border-b-2 border-gray-900 uppercase tracking-wide">
            Education
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-bold text-gray-900 text-xs">
                {edu.degree}
              </div>
              <div className="text-gray-700 text-xs">{edu.school}</div>
              <div className="text-gray-600 text-xs">{edu.year}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
);

// Template 5: Tech Developer
const TechDeveloperTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-gray-900 text-green-400 font-mono text-xs">
    <div className="p-6 border-b border-green-400">
      <div className="text-green-400 mb-2">{">"} whoami</div>
      <h1 className="text-lg font-bold text-white mb-1">{data.fullName}</h1>
      <div className="text-green-300 mb-2">{data.experience[0]?.position}</div>
      <div className="text-gray-400 space-y-1">
        <div>
          {">"} contact --email {data.email}
        </div>
        <div>
          {">"} contact --phone {data.phone}
        </div>
        <div>
          {">"} location {data.location}
        </div>
      </div>
    </div>

    <div className="p-6 space-y-4">
      <section>
        <div className="text-green-400 mb-2">{">"} cat about.txt</div>
        <p className="text-gray-300 leading-relaxed pl-4">{data.summary}</p>
      </section>

      <section>
        <div className="text-green-400 mb-2">{">"} ls -la experience/</div>
        {data.experience.map((exp, idx) => (
          <div key={idx} className="mb-3 pl-4">
            <div className="text-white font-bold">{exp.position}</div>
            <div className="text-green-300">@ {exp.company}</div>
            <div className="text-gray-400">{exp.duration}</div>
            <p className="text-gray-300 mt-1 leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <div className="text-green-400 mb-2">{">"} cat skills.json</div>
          <div className="pl-4">
            <div className="text-white">{"{"}</div>
            {data.skills.map((skill, idx) => (
              <div key={idx} className="text-gray-300 pl-2">
                "{skill}": "advanced"{idx < data.skills.length - 1 ? "," : ""}
              </div>
            ))}
            <div className="text-white">{"}"}</div>
          </div>
        </section>

        <section>
          <div className="text-green-400 mb-2">{">"} cat education.md</div>
          {data.education.map((edu, idx) => (
            <div key={idx} className="pl-4 mb-2">
              <div className="text-white font-bold">## {edu.degree}</div>
              <div className="text-gray-300">{edu.school}</div>
              <div className="text-gray-400">{edu.year}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
);

// Template 6: Academic Scholar
const AcademicScholarTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full p-8 text-xs font-serif bg-white">
    <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.fullName}</h1>
      <div className="text-gray-700 font-medium mb-2">
        {data.experience[0]?.position}
      </div>
      <div className="text-gray-600 space-x-2">
        <span>{data.email}</span>
        <span>•</span>
        <span>{data.phone}</span>
        <span>•</span>
        <span>{data.location}</span>
      </div>
    </div>

    <div className="space-y-5">
      <section>
        <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-widest">
          Research Interests
        </h2>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </section>

      <section>
        <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-widest">
          Academic Positions
        </h2>
        {data.experience.map((exp, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-gray-900">{exp.position}</h3>
              <span className="text-gray-600">{exp.duration}</span>
            </div>
            <div className="text-gray-700 italic mb-1">{exp.company}</div>
            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-widest">
            Education
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="font-bold text-gray-900">{edu.degree}</div>
              <div className="text-gray-700 italic">{edu.school}</div>
              <div className="text-gray-600">{edu.year}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-widest">
            Research Areas
          </h2>
          <div className="space-y-1">
            {data.skills.map((skill, idx) => (
              <div key={idx} className="text-gray-700">
                • {skill}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

// Template 7: Healthcare Pro
const HealthcareProTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-white">
    <div className="bg-green-600 text-white p-6">
      <h1 className="text-2xl font-bold mb-1">{data.fullName}</h1>
      <div className="text-green-100 font-medium mb-2">
        {data.experience[0]?.position}
      </div>
      <div className="text-green-200 text-xs space-y-1">
        <div>
          {data.email} | {data.phone}
        </div>
        <div>{data.location}</div>
      </div>
    </div>

    <div className="p-6 space-y-4">
      <section>
        <h2 className="text-sm font-bold text-green-700 mb-2 uppercase tracking-wide border-b border-green-200 pb-1">
          Professional Summary
        </h2>
        <p className="text-gray-700 text-xs leading-relaxed">{data.summary}</p>
      </section>

      <section>
        <h2 className="text-sm font-bold text-green-700 mb-3 uppercase tracking-wide border-b border-green-200 pb-1">
          Clinical Experience
        </h2>
        {data.experience.map((exp, idx) => (
          <div key={idx} className="mb-4 border-l-4 border-green-300 pl-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-gray-900 text-xs">
                {exp.position}
              </h3>
              <span className="text-gray-600 text-xs">{exp.duration}</span>
            </div>
            <div className="text-green-600 font-medium text-xs mb-2">
              {exp.company}
            </div>
            <p className="text-gray-700 text-xs leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-bold text-green-700 mb-3 uppercase tracking-wide border-b border-green-200 pb-1">
            Clinical Skills
          </h2>
          <div className="space-y-1">
            {data.skills.map((skill, idx) => (
              <div
                key={idx}
                className="text-gray-700 text-xs flex items-center"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                {skill}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-green-700 mb-3 uppercase tracking-wide border-b border-green-200 pb-1">
            Education & Licensing
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-3 bg-green-50 p-3 rounded">
              <div className="font-bold text-gray-900 text-xs">
                {edu.degree}
              </div>
              <div className="text-green-600 text-xs">{edu.school}</div>
              <div className="text-gray-600 text-xs">{edu.year}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
);

// Template 8: Sales Achiever
const SalesAchieverTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-gradient-to-br from-red-50 to-orange-50">
    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
      <h1 className="text-2xl font-bold mb-1">{data.fullName}</h1>
      <div className="text-red-100 font-medium mb-2">
        {data.experience[0]?.position}
      </div>
      <div className="text-red-200 text-xs space-y-1">
        <div>
          {data.email} | {data.phone}
        </div>
        <div>{data.location}</div>
      </div>
    </div>

    <div className="p-6 space-y-4">
      <section>
        <h2 className="text-sm font-bold text-red-700 mb-3 flex items-center">
          <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
          SALES PERFORMANCE
        </h2>
        <p className="text-gray-700 text-xs leading-relaxed">{data.summary}</p>
      </section>

      <section>
        <h2 className="text-sm font-bold text-red-700 mb-3 flex items-center">
          <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
          KEY ACHIEVEMENTS
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {data.achievements.map((achievement, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-red-400"
            >
              <div className="text-gray-700 text-xs font-medium">
                • {achievement}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-red-700 mb-3 flex items-center">
          <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
          SALES EXPERIENCE
        </h2>
        {data.experience.map((exp, idx) => (
          <div key={idx} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-gray-900 text-xs">
                {exp.position}
              </h3>
              <span className="text-gray-600 text-xs">{exp.duration}</span>
            </div>
            <div className="text-red-600 font-medium text-xs mb-2">
              {exp.company}
            </div>
            <p className="text-gray-700 text-xs leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-bold text-red-700 mb-3 flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            CORE SKILLS
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-2 py-1 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-red-700 mb-3 flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            EDUCATION
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg shadow-sm">
              <div className="font-bold text-gray-900 text-xs">
                {edu.degree}
              </div>
              <div className="text-red-600 text-xs">{edu.school}</div>
              <div className="text-gray-600 text-xs">{edu.year}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
);

// Template 9: Consultant Expert
const ConsultantExpertTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-white border-t-8 border-indigo-600">
    <div className="p-6 text-center border-b border-indigo-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.fullName}</h1>
      <div className="text-indigo-600 font-medium mb-2">
        {data.experience[0]?.position}
      </div>
      <div className="text-gray-600 text-xs space-x-2">
        <span>{data.email}</span>
        <span>|</span>
        <span>{data.phone}</span>
        <span>|</span>
        <span>{data.location}</span>
      </div>
    </div>

    <div className="p-6 space-y-5">
      <section>
        <h2 className="text-sm font-bold text-indigo-700 mb-2 uppercase tracking-wide">
          Consulting Expertise
        </h2>
        <p className="text-gray-700 text-xs leading-relaxed">{data.summary}</p>
      </section>

      <section>
        <h2 className="text-sm font-bold text-indigo-700 mb-3 uppercase tracking-wide">
          Client Engagements
        </h2>
        {data.experience.map((exp, idx) => (
          <div
            key={idx}
            className="mb-4 border-l-4 border-indigo-300 pl-4 bg-indigo-50 p-3 rounded-r-lg"
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-gray-900 text-xs">
                {exp.position}
              </h3>
              <span className="text-gray-600 text-xs">{exp.duration}</span>
            </div>
            <div className="text-indigo-600 font-medium text-xs mb-2">
              {exp.company}
            </div>
            <p className="text-gray-700 text-xs leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-bold text-indigo-700 mb-3 uppercase tracking-wide">
            Methodologies
          </h2>
          <div className="space-y-2">
            {data.skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center text-gray-700 text-xs"
              >
                <div className="w-3 h-3 border-2 border-indigo-400 rounded-full mr-2 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                </div>
                {skill}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-indigo-700 mb-3 uppercase tracking-wide">
            Education
          </h2>
          {data.education.map((edu, idx) => (
            <div
              key={idx}
              className="mb-3 bg-gray-50 p-3 rounded border-l-4 border-indigo-300"
            >
              <div className="font-bold text-gray-900 text-xs">
                {edu.degree}
              </div>
              <div className="text-indigo-600 text-xs">{edu.school}</div>
              <div className="text-gray-600 text-xs">{edu.year}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
);

// Template 10: Startup Innovator
const StartupInnovatorTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-white">
    <div className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 p-1">
      <div className="bg-white p-5">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent mb-1">
          {data.fullName}
        </h1>
        <div className="text-gray-700 font-medium mb-2">
          {data.experience[0]?.position}
        </div>
        <div className="text-gray-600 text-xs space-y-1">
          <div>
            {data.email} | {data.phone}
          </div>
          <div>{data.location}</div>
        </div>
      </div>
    </div>

    <div className="p-6 space-y-4">
      <section>
        <h2 className="text-sm font-bold mb-2 flex items-center">
          <div className="w-8 h-1 bg-gradient-to-r from-teal-400 to-purple-600 mr-2"></div>
          INNOVATION MINDSET
        </h2>
        <p className="text-gray-700 text-xs leading-relaxed">{data.summary}</p>
      </section>

      <section>
        <h2 className="text-sm font-bold mb-3 flex items-center">
          <div className="w-8 h-1 bg-gradient-to-r from-teal-400 to-purple-600 mr-2"></div>
          STARTUP JOURNEY
        </h2>
        {data.experience.map((exp, idx) => (
          <div key={idx} className="mb-4 relative">
            <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-purple-600"></div>
            <div className="ml-6">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 text-xs">
                  {exp.position}
                </h3>
                <span className="text-gray-600 text-xs">{exp.duration}</span>
              </div>
              <div className="text-purple-600 font-medium text-xs mb-2">
                {exp.company}
              </div>
              <p className="text-gray-700 text-xs leading-relaxed">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-bold mb-3 flex items-center">
            <div className="w-8 h-1 bg-gradient-to-r from-teal-400 to-purple-600 mr-2"></div>
            TECH STACK
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {data.skills.map((skill, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-teal-50 to-purple-50 border border-purple-200 p-2 rounded text-center"
              >
                <span className="text-gray-700 text-xs font-medium">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold mb-3 flex items-center">
            <div className="w-8 h-1 bg-gradient-to-r from-teal-400 to-purple-600 mr-2"></div>
            EDUCATION
          </h2>
          {data.education.map((edu, idx) => (
            <div
              key={idx}
              className="mb-3 p-3 border border-gray-200 rounded-lg"
            >
              <div className="font-bold text-gray-900 text-xs">
                {edu.degree}
              </div>
              <div className="bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent text-xs font-medium">
                {edu.school}
              </div>
              <div className="text-gray-600 text-xs">{edu.year}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
);
