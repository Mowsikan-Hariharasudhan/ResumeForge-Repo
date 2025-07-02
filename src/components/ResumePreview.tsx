import React from 'react';
import { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  data: ResumeData;
  template: string;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
      case 'professional':
      case 'sidebar':
      case 'recruiter':
      case 'consultant':
      case 'finance':
      case 'minimal':
      case 'modern-minimal':
        return <ModernTemplate data={data} />;
      
      case 'creative':
      case 'infographic':
      case 'marketing':
      case 'architect':
        return <CreativeTemplate data={data} />;
      
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      
      case 'technical':
        return <TechnicalTemplate data={data} />;
      
      case 'academic':
      case 'education':
        return <AcademicTemplate data={data} />;
      
      case 'startup':
        return <StartupTemplate data={data} />;
      
      case 'healthcare':
        return <HealthcareTemplate data={data} />;
      
      case 'legal':
        return <LegalTemplate data={data} />;
      
      case 'nonprofit':
        return <NonProfitTemplate data={data} />;
      
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="w-full h-full bg-white">
      {renderTemplate()}
    </div>
  );
};

// Modern Template Component
const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white min-h-full">
    {/* Header */}
    <div className="border-b-2 border-gray-300 pb-6 mb-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.fullName}</h1>
      <div className="flex flex-wrap gap-4 text-gray-600">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>{data.phone}</span>}
        {data.location && <span>{data.location}</span>}
      </div>
      <div className="flex flex-wrap gap-4 text-blue-600 mt-2">
        {data.website && <a href={data.website} className="hover:underline">{data.website}</a>}
        {data.linkedin && <a href={data.linkedin} className="hover:underline">LinkedIn</a>}
        {data.github && <a href={data.github} className="hover:underline">GitHub</a>}
      </div>
    </div>

    {/* Summary */}
    {data.summary && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          PROFESSIONAL SUMMARY
        </h2>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </div>
    )}

    {/* Achievements */}
    {data.achievements && data.achievements.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          KEY ACHIEVEMENTS
        </h2>
        <ul className="space-y-2">
          {data.achievements.map((achievement, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-gray-700">{achievement}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Experience */}
    {data.experience && data.experience.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          PROFESSIONAL EXPERIENCE
        </h2>
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                <span className="text-gray-600 text-sm">{exp.duration}</span>
              </div>
              <p className="text-blue-600 font-medium mb-2">{exp.company}</p>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {data.education && data.education.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          EDUCATION
        </h2>
        <div className="space-y-3">
          {data.education.map((edu, index) => (
            <div key={index}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-blue-600">{edu.school}</p>
                  {edu.grade && <p className="text-gray-600">{edu.grade}</p>}
                </div>
                <span className="text-gray-600">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Skills */}
    {data.skills && data.skills.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          TECHNICAL SKILLS
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Projects */}
    {data.projects && data.projects.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          PROJECTS
        </h2>
        <div className="space-y-4">
          {data.projects.map((project, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                {project.link && (
                  <a href={project.link} className="text-blue-600 hover:underline text-sm">
                    View Project
                  </a>
                )}
              </div>
              <p className="text-gray-700 mb-1">{project.description}</p>
              <p className="text-blue-600 text-sm">
                <strong>Technologies:</strong> {project.technologies}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Languages & Certifications */}
    <div className="grid md:grid-cols-2 gap-6">
      {data.languages && data.languages.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
            LANGUAGES
          </h2>
          <ul className="space-y-1">
            {data.languages.map((language, index) => (
              <li key={index} className="text-gray-700">{language}</li>
            ))}
          </ul>
        </div>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
            CERTIFICATIONS
          </h2>
          <div className="space-y-2">
            {data.certifications.map((cert, index) => (
              <div key={index}>
                <h3 className="font-medium text-gray-900">{cert.name}</h3>
                <p className="text-gray-600 text-sm">{cert.issuer} • {cert.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Creative Template Component
const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 min-h-full">
    {/* Header */}
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">{data.fullName}</h1>
      <p className="text-purple-100 text-lg mb-4">{data.experience[0]?.position}</p>
      <div className="flex flex-wrap gap-4 text-purple-200">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>{data.phone}</span>}
        {data.location && <span>{data.location}</span>}
      </div>
    </div>

    <div className="p-8">
      {/* Summary */}
      {data.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Creative Vision</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-purple-600 font-medium">{exp.duration}</span>
                </div>
                <p className="text-purple-700 font-medium mb-3">{exp.company}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-purple-600">{edu.school}</p>
                <div className="flex justify-between text-gray-600 mt-1">
                  <span>{edu.year}</span>
                  {edu.grade && <span>{edu.grade}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Executive Template Component
const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white min-h-full font-serif">
    {/* Header */}
    <div className="text-center border-b-4 border-gray-800 pb-6 mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-wide">{data.fullName}</h1>
      <p className="text-xl text-gray-700 mb-4">{data.experience[0]?.position}</p>
      <div className="flex justify-center gap-6 text-gray-600">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>{data.phone}</span>}
        {data.location && <span>{data.location}</span>}
      </div>
    </div>

    {/* Executive Summary */}
    {data.summary && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
          EXECUTIVE SUMMARY
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">{data.summary}</p>
      </div>
    )}

    {/* Professional Experience */}
    {data.experience && data.experience.length > 0 && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
          PROFESSIONAL EXPERIENCE
        </h2>
        <div className="space-y-6">
          {data.experience.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                <span className="text-gray-600 italic">{exp.duration}</span>
              </div>
              <p className="text-gray-700 font-medium mb-3 italic">{exp.company}</p>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {data.education && data.education.length > 0 && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
          EDUCATION
        </h2>
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
              <p className="text-gray-700">{edu.school}</p>
              <div className="flex justify-between text-gray-600">
                <span>{edu.year}</span>
                {edu.grade && <span>{edu.grade}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Technical Template Component
const TechnicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="max-w-4xl mx-auto bg-gray-900 text-white min-h-full font-mono">
    <div className="p-8">
      {/* Header */}
      <div className="border-b border-gray-700 pb-6 mb-6">
        <div className="text-green-400 mb-2">$ whoami</div>
        <h1 className="text-3xl font-bold text-white mb-2">{data.fullName}</h1>
        <p className="text-gray-300 text-lg mb-4">{data.experience[0]?.position}</p>
        <div className="text-gray-400 space-y-1">
          {data.email && <div>📧 {data.email}</div>}
          {data.phone && <div>📱 {data.phone}</div>}
          {data.location && <div>📍 {data.location}</div>}
        </div>
      </div>

      {/* About */}
      {data.summary && (
        <div className="mb-6">
          <div className="text-green-400 font-bold mb-2">~/about</div>
          <p className="text-gray-300 leading-relaxed pl-4">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <div className="text-green-400 font-bold mb-2">~/experience</div>
          <div className="space-y-4 pl-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold">{exp.position}</h3>
                <p className="text-gray-400">{exp.company} | {exp.duration}</p>
                <p className="text-gray-300 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-6">
          <div className="text-green-400 font-bold mb-2">~/skills</div>
          <div className="pl-4">
            <p className="text-gray-300">{data.skills.join(' | ')}</p>
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6">
          <div className="text-green-400 font-bold mb-2">~/education</div>
          <div className="space-y-2 pl-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <p className="text-white">{edu.degree}</p>
                <p className="text-gray-400">{edu.school} | {edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Academic Template Component
const AcademicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white min-h-full font-serif">
    {/* Header */}
    <div className="text-center border-b-4 border-gray-800 pb-6 mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.fullName}</h1>
      <p className="text-xl text-gray-700 mb-4">{data.experience[0]?.position}</p>
      <div className="text-gray-600">
        {data.email && <div>{data.email}</div>}
        {data.location && <div>{data.location}</div>}
      </div>
    </div>

    {/* Education */}
    {data.education && data.education.length > 0 && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">EDUCATION</h2>
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
              <p className="text-gray-700">{edu.school}, {edu.year}</p>
              {edu.grade && <p className="text-gray-600">{edu.grade}</p>}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Academic Positions */}
    {data.experience && data.experience.length > 0 && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ACADEMIC POSITIONS</h2>
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
              <p className="text-gray-700 italic">{exp.company}, {exp.duration}</p>
              <p className="text-gray-700 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Research Interests */}
    {data.skills && data.skills.length > 0 && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">RESEARCH INTERESTS</h2>
        <p className="text-gray-700">{data.skills.join(', ')}</p>
      </div>
    )}
  </div>
);

// Startup Template Component
const StartupTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="max-w-4xl mx-auto bg-gradient-to-br from-orange-50 to-red-50 min-h-full">
    {/* Header */}
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">{data.fullName}</h1>
      <p className="text-orange-100 text-lg mb-4">{data.experience[0]?.position}</p>
      <div className="flex flex-wrap gap-4 text-orange-200">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>{data.phone}</span>}
        {data.location && <span>{data.location}</span>}
      </div>
    </div>

    <div className="p-8">
      {/* Entrepreneurial Vision */}
      {data.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">Entrepreneurial Vision</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Key Achievements */}
      {data.achievements && data.achievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">Key Achievements</h2>
          <div className="space-y-3">
            {data.achievements.map((achievement, index) => (
              <div key={index} className="flex items-start">
                <span className="text-orange-600 mr-3 text-xl">🚀</span>
                <span className="text-gray-700">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-orange-600 font-medium">{exp.duration}</span>
                </div>
                <p className="text-orange-700 font-medium mb-3">{exp.company}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Healthcare Template Component
const HealthcareTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white min-h-full border-l-8 border-green-500">
    {/* Header */}
    <div className="text-center border-b-2 border-green-200 pb-6 mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.fullName}</h1>
      <p className="text-xl text-green-700 mb-4">{data.experience[0]?.position}</p>
      <div className="flex justify-center gap-6 text-gray-600">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>{data.phone}</span>}
        {data.location && <span>{data.location}</span>}
      </div>
    </div>

    {/* Medical Expertise */}
    {data.summary && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Medical Expertise</h2>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </div>
    )}

    {/* Professional Experience */}
    {data.experience && data.experience.length > 0 && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Professional Experience</h2>
        <div className="space-y-6">
          {data.experience.map((exp, index) => (
            <div key={index} className="border-l-4 border-green-300 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                <span className="text-gray-600">{exp.duration}</span>
              </div>
              <p className="text-green-600 font-medium mb-3">{exp.company}</p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {data.education && data.education.length > 0 && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Education</h2>
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
              <p className="text-green-600">{edu.school}</p>
              <div className="flex justify-between text-gray-600">
                <span>{edu.year}</span>
                {edu.grade && <span>{edu.grade}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Legal Template Component
const LegalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white min-h-full font-serif">
    {/* Header */}
    <div className="text-center border-b-4 border-gray-800 pb-6 mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.fullName}</h1>
      <p className="text-xl text-gray-700 mb-4">{data.experience[0]?.position}</p>
      <div className="text-gray-600">
        {data.email && <div>{data.email}</div>}
        {data.location && <div>{data.location}</div>}
      </div>
    </div>

    {/* Legal Expertise */}
    {data.summary && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
          LEGAL EXPERTISE
        </h2>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </div>
    )}

    {/* Professional Experience */}
    {data.experience && data.experience.length > 0 && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
          PROFESSIONAL EXPERIENCE
        </h2>
        <div className="space-y-6">
          {data.experience.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                <span className="text-gray-600 italic">{exp.duration}</span>
              </div>
              <p className="text-gray-700 font-medium mb-3">{exp.company}</p>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {data.education && data.education.length > 0 && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
          EDUCATION
        </h2>
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
              <p className="text-gray-700">{edu.school}</p>
              <div className="flex justify-between text-gray-600">
                <span>{edu.year}</span>
                {edu.grade && <span>{edu.grade}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Non-Profit Template Component
const NonProfitTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-cyan-50 min-h-full">
    {/* Header */}
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">{data.fullName}</h1>
      <p className="text-blue-100 text-lg mb-4">{data.experience[0]?.position}</p>
      <div className="flex flex-wrap gap-4 text-blue-200">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>{data.phone}</span>}
        {data.location && <span>{data.location}</span>}
      </div>
    </div>

    <div className="p-8">
      {/* Mission & Impact */}
      {data.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Mission & Impact</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Key Achievements */}
      {data.achievements && data.achievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Key Achievements</h2>
          <div className="space-y-3">
            {data.achievements.map((achievement, index) => (
              <div key={index} className="flex items-start">
                <span className="text-blue-600 mr-3 text-xl">🌟</span>
                <span className="text-gray-700">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-blue-600 font-medium">{exp.duration}</span>
                </div>
                <p className="text-blue-700 font-medium mb-3">{exp.company}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);