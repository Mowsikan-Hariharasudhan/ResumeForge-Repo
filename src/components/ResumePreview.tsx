import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { ResumePreviewProps } from '@/types/ResumePreviewProps';
import { TemplateRenderer } from "./TemplateRenderer";

// Helper: List of all field keys and labels
const FIELD_OPTIONS = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'location', label: 'Location' },
  { key: 'website', label: 'Website' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'github', label: 'GitHub' },
  { key: 'summary', label: 'Summary' },
  { key: 'achievements', label: 'Key Achievements' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'languages', label: 'Languages' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'projects', label: 'Projects' },
];

// New: Field visibility controls
export const ResumeFieldVisibility: React.FC<{
  visibleFields: Record<string, boolean>;
  onChange: (fields: Record<string, boolean>) => void;
}> = ({ visibleFields, onChange }) => (
  <div className="mb-4 flex flex-wrap gap-2">
    {FIELD_OPTIONS.map(opt => (
      <label key={opt.key} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer">
        <input
          type="checkbox"
          checked={visibleFields[opt.key]}
          onChange={e => onChange({ ...visibleFields, [opt.key]: e.target.checked })}
        />
        {opt.label}
      </label>
    ))}
  </div>
);

// Helper to render all resume fields, respecting visibility
export const RenderAllFields: React.FC<{ data: ResumeData | undefined | null; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => {
  if (!data || typeof data !== 'object') {
    return <div className="text-red-600">No resume data available.</div>;
  }
  // Provide fallback values for all fields
  const safeData = {
    fullName: data.fullName || 'No Name',
    email: data.email || '',
    phone: data.phone || '',
    location: data.location || '',
    website: data.website || '',
    linkedin: data.linkedin || '',
    github: data.github || '',
    summary: data.summary || '',
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
  };
  return (
    <div className="space-y-4">
      {visibleFields.fullName && (
        <div>
          <h2 className="text-2xl font-bold">{safeData.fullName}</h2>
          <div className="flex flex-wrap gap-4 text-gray-600">
            {visibleFields.email && safeData.email && <span>{safeData.email}</span>}
            {visibleFields.phone && safeData.phone && <span>{safeData.phone}</span>}
            {visibleFields.location && safeData.location && <span>{safeData.location}</span>}
          </div>
          <div className="flex flex-wrap gap-4 text-blue-600 mt-2">
            {visibleFields.website && safeData.website && <a href={safeData.website} className="hover:underline">{safeData.website}</a>}
            {visibleFields.linkedin && safeData.linkedin && <a href={safeData.linkedin} className="hover:underline">LinkedIn</a>}
            {visibleFields.github && safeData.github && <a href={safeData.github} className="hover:underline">GitHub</a>}
          </div>
        </div>
      )}
      {visibleFields.summary && safeData.summary && <div><h3 className="font-semibold">Summary</h3><p>{safeData.summary}</p></div>}
      {visibleFields.achievements && safeData.achievements.length > 0 && (
        <div>
          <h3 className="font-semibold">Key Achievements</h3>
          <ul className="list-disc ml-6">{safeData.achievements.map((ach, i) => <li key={i}>{ach}</li>)}</ul>
        </div>
      )}
      {visibleFields.experience && safeData.experience.length > 0 && (
        <div>
          <h3 className="font-semibold">Experience</h3>
          <ul className="list-disc ml-6">{safeData.experience.map((exp, i) => (
            <li key={i}><b>{exp.position || 'No Position'}</b> at {exp.company || 'No Company'} ({exp.duration || 'No Duration'})<br/>{exp.description || ''}</li>
          ))}</ul>
        </div>
      )}
      {visibleFields.education && safeData.education.length > 0 && (
        <div>
          <h3 className="font-semibold">Education</h3>
          <ul className="list-disc ml-6">{safeData.education.map((edu, i) => (
            <li key={i}><b>{edu.degree || 'No Degree'}</b> at {edu.school || 'No School'} ({edu.year || 'No Year'}){edu.grade && ` - ${edu.grade}`}</li>
          ))}</ul>
        </div>
      )}
      {visibleFields.skills && safeData.skills.length > 0 && (
        <div>
          <h3 className="font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">{safeData.skills.map((skill, i) => <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{skill}</span>)}</div>
        </div>
      )}
      {visibleFields.languages && safeData.languages.length > 0 && (
        <div>
          <h3 className="font-semibold">Languages</h3>
          <div className="flex flex-wrap gap-2">{safeData.languages.map((lang, i) => <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{lang}</span>)}</div>
        </div>
      )}
      {visibleFields.certifications && safeData.certifications.length > 0 && (
        <div>
          <h3 className="font-semibold">Certifications</h3>
          <ul className="list-disc ml-6">{safeData.certifications.map((cert, i) => (
            <li key={i}><b>{cert.name || 'No Name'}</b> ({cert.issuer || 'No Issuer'}, {cert.year || 'No Year'})</li>
          ))}</ul>
        </div>
      )}
      {visibleFields.projects && safeData.projects.length > 0 && (
        <div>
          <h3 className="font-semibold">Projects</h3>
          <ul className="list-disc ml-6">{safeData.projects.map((proj, i) => (
            <li key={i}><b>{proj.name || 'No Name'}</b>: {proj.description || ''} <span className="text-xs text-gray-500">[{proj.technologies || ''}]</span> {proj.link && <a href={proj.link} className="text-blue-600 underline ml-2">Link</a>}</li>
          ))}</ul>
        </div>
      )}
    </div>
  );
};

// Make all templates use RenderAllFields for field visibility
const TestTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-yellow-50 border-l-8 border-yellow-400 font-mono">
    <div className="mb-2 text-yellow-700 font-bold text-lg">Test Template</div>
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </div>
);

// Update all template stubs to use RenderAllFields
const ExecutiveTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => <RenderAllFields data={data} visibleFields={visibleFields} />;
const LegalTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => <RenderAllFields data={data} visibleFields={visibleFields} />;
const StartupTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => <RenderAllFields data={data} visibleFields={visibleFields} />;
const ModernTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => <RenderAllFields data={data} visibleFields={visibleFields} />;
const CreativeTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => <RenderAllFields data={data} visibleFields={visibleFields} />;
const TechnicalTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => <RenderAllFields data={data} visibleFields={visibleFields} />;
const AcademicTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => <RenderAllFields data={data} visibleFields={visibleFields} />;
const HealthcareTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => <RenderAllFields data={data} visibleFields={visibleFields} />;
const NonProfitTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => <RenderAllFields data={data} visibleFields={visibleFields} />;
const UniversalTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-white font-sans border border-gray-200 rounded-xl">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </div>
);

// New visually distinct templates
const ModernBlueTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-blue-50 border-l-8 border-blue-500 font-sans shadow-md rounded-xl">
    <div className="mb-2 text-blue-700 font-bold text-lg">Modern Blue</div>
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </div>
);
const ClassicEleganceTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-white border-2 border-gray-300 font-serif rounded-lg">
    <div className="mb-2 text-gray-700 font-bold text-lg tracking-wide">Classic Elegance</div>
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </div>
);
const MinimalistBlackTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-white border border-black font-sans">
    <div className="mb-2 text-black font-extrabold text-xl uppercase">Minimalist Black</div>
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </div>
);
const CreativeGradientTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 font-sans rounded-2xl shadow-lg">
    <div className="mb-2 text-purple-700 font-bold text-lg">Creative Gradient</div>
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </div>
);
const ProfessionalGrayTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-gray-50 border-l-4 border-gray-400 font-sans">
    <div className="mb-2 text-gray-800 font-bold text-lg">Professional Gray</div>
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </div>
);
const TechCircuitTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-gray-900 text-green-300 font-mono border-2 border-green-400 rounded-xl relative overflow-hidden">
    <div className="mb-2 text-green-400 font-bold text-lg">Tech Circuit</div>
    <RenderAllFields data={data} visibleFields={visibleFields} />
    <div className="absolute inset-0 pointer-events-none" style={{background: 'repeating-linear-gradient(135deg, transparent, transparent 10px, rgba(34,197,94,0.1) 10px, rgba(34,197,94,0.1) 20px)'}}></div>
  </div>
);
const ElegantGoldTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-white border-2 border-yellow-400 font-serif rounded-2xl shadow-gold">
    <div className="mb-2 text-yellow-700 font-bold text-lg">Elegant Gold</div>
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </div>
);
const BoldRedTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-red-50 border-l-8 border-red-500 font-sans">
    <div className="mb-2 text-red-700 font-bold text-lg">Bold Red</div>
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </div>
);
const SoftPastelTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 rounded-3xl font-sans">
    <div className="mb-2 text-pink-600 font-bold text-lg">Soft Pastel</div>
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </div>
);
const GeometricBlocksTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-white font-sans border-4 border-indigo-400 rounded-lg" style={{boxShadow: '8px 8px 0 #a5b4fc'}}>
    <div className="mb-2 text-indigo-700 font-bold text-lg">Geometric Blocks</div>
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </div>
);
const MonoSpaceTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="p-8 bg-gray-100 border border-gray-400 font-mono">
    <div className="mb-2 text-gray-700 font-bold text-lg">Mono Space</div>
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </div>
);

// --- NEW TEMPLATES ---
// 1. Sidebar Left Template
const SidebarLeftTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="flex bg-white rounded-xl shadow-lg overflow-hidden min-h-[500px]">
    <div className="w-1/3 bg-blue-900 text-white p-6 flex flex-col gap-4">
      {visibleFields.fullName && <h2 className="text-xl font-bold mb-2">{data.fullName}</h2>}
      {visibleFields.email && <div className="text-xs">{data.email}</div>}
      {visibleFields.phone && <div className="text-xs">{data.phone}</div>}
      {visibleFields.location && <div className="text-xs">{data.location}</div>}
      {visibleFields.skills && Array.isArray(data.skills) && data.skills.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-1">Skills</h3>
          <ul className="list-disc ml-4 text-xs space-y-1">
            {data.skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </div>
      )}
      {visibleFields.languages && Array.isArray(data.languages) && data.languages.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-1">Languages</h3>
          <ul className="list-disc ml-4 text-xs space-y-1">
            {data.languages.map((lang, i) => <li key={i}>{lang}</li>)}
          </ul>
        </div>
      )}
    </div>
    <div className="w-2/3 p-8">
      {visibleFields.summary && data.summary && <div className="mb-4"><h3 className="font-bold text-lg">Summary</h3><p>{data.summary}</p></div>}
      {visibleFields.experience && Array.isArray(data.experience) && data.experience.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold text-lg">Experience</h3>
          <ul className="space-y-2">{data.experience.map((exp, i) => (
            <li key={i}>
              <b>{exp.position}</b> at {exp.company} <span className="text-xs text-gray-500">({exp.duration})</span><br/>
              <span className="text-sm">{exp.description}</span>
            </li>
          ))}</ul>
        </div>
      )}
      {visibleFields.education && Array.isArray(data.education) && data.education.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold text-lg">Education</h3>
          <ul className="space-y-1">{data.education.map((edu, i) => (
            <li key={i}><b>{edu.degree}</b> at {edu.school} ({edu.year}){edu.grade && ` - ${edu.grade}`}</li>
          ))}</ul>
        </div>
      )}
      {visibleFields.projects && Array.isArray(data.projects) && data.projects.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold text-lg">Projects</h3>
          <ul className="space-y-1">{data.projects.map((proj, i) => (
            <li key={i}><b>{proj.name}</b>: {proj.description} <span className="text-xs text-gray-500">[{proj.technologies}]</span> {proj.link && <a href={proj.link} className="text-blue-600 underline ml-2">Link</a>}</li>
          ))}</ul>
        </div>
      )}
    </div>
  </div>
);

// 2. Two Column Split Template
const TwoColumnSplitTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="grid grid-cols-2 gap-8 bg-gray-50 rounded-xl p-8 min-h-[500px]">
    <div>
      {visibleFields.fullName && <h2 className="text-2xl font-bold mb-2">{data.fullName}</h2>}
      {visibleFields.summary && data.summary && <div className="mb-4"><h3 className="font-semibold">Summary</h3><p>{data.summary}</p></div>}
      {visibleFields.skills && Array.isArray(data.skills) && data.skills.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">{data.skills.map((skill, i) => <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{skill}</span>)}</div>
        </div>
      )}
      {visibleFields.languages && Array.isArray(data.languages) && data.languages.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold">Languages</h3>
          <div className="flex flex-wrap gap-2">{data.languages.map((lang, i) => <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{lang}</span>)}</div>
        </div>
      )}
    </div>
    <div>
      {visibleFields.experience && Array.isArray(data.experience) && data.experience.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold">Experience</h3>
          <ul className="list-disc ml-6">
            {data.experience.map((exp, i) => (
              <li key={i}><b>{exp.position}</b> at {exp.company} ({exp.duration})<br/>{exp.description}</li>
            ))}
          </ul>
        </div>
      )}
      {visibleFields.education && Array.isArray(data.education) && data.education.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold">Education</h3>
          <ul className="list-disc ml-6">
            {data.education.map((edu, i) => (
              <li key={i}><b>{edu.degree}</b> at {edu.school} ({edu.year}){edu.grade && ` - ${edu.grade}`}</li>
            ))}
          </ul>
        </div>
      )}
      {visibleFields.projects && Array.isArray(data.projects) && data.projects.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold">Projects</h3>
          <ul className="list-disc ml-6">
            {data.projects.map((proj, i) => (
              <li key={i}><b>{proj.name}</b>: {proj.description} <span className="text-xs text-gray-500">[{proj.technologies}]</span> {proj.link && <a href={proj.link} className="text-blue-600 underline ml-2">Link</a>}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

// 3. Header Heavy Template
const HeaderHeavyTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white rounded-xl shadow-lg min-h-[500px]">
    <div className="p-8 border-b-4 border-yellow-400">
      {visibleFields.fullName && <h1 className="text-4xl font-extrabold mb-2">{data.fullName}</h1>}
      <div className="flex flex-wrap gap-4 text-yellow-200 text-sm">
        {visibleFields.email && data.email && <span>{data.email}</span>}
        {visibleFields.phone && data.phone && <span>{data.phone}</span>}
        {visibleFields.location && data.location && <span>{data.location}</span>}
      </div>
      {visibleFields.summary && data.summary && <div className="mt-4 text-lg italic">{data.summary}</div>}
    </div>
    <div className="p-8 grid grid-cols-2 gap-8">
      <div>
        {visibleFields.experience && Array.isArray(data.experience) && data.experience.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-yellow-300">Experience</h3>
            <ul className="space-y-2">
              {data.experience.map((exp, i) => (
                <li key={i}><b>{exp.position}</b> at {exp.company} <span className="text-xs">({exp.duration})</span><br/>{exp.description}</li>
              ))}
            </ul>
          </div>
        )}
        {visibleFields.education && Array.isArray(data.education) && data.education.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-yellow-300">Education</h3>
            <ul className="space-y-1">
              {data.education.map((edu, i) => (
                <li key={i}><b>{edu.degree}</b> at {edu.school} ({edu.year}){edu.grade && ` - ${edu.grade}`}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        {visibleFields.skills && Array.isArray(data.skills) && data.skills.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-yellow-300">Skills</h3>
            <div className="flex flex-wrap gap-2">{data.skills.map((skill, i) => <span key={i} className="bg-yellow-200 text-gray-900 px-2 py-1 rounded text-xs">{skill}</span>)}</div>
          </div>
        )}
        {visibleFields.projects && Array.isArray(data.projects) && data.projects.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-yellow-300">Projects</h3>
            <ul className="space-y-1">
              {data.projects.map((proj, i) => (
                <li key={i}><b>{proj.name}</b>: {proj.description} <span className="text-xs text-gray-200">[{proj.technologies}]</span> {proj.link && <a href={proj.link} className="text-yellow-200 underline ml-2">Link</a>}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);

// 4. Timeline Template
export const TimelineTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="bg-white p-8 rounded-xl shadow-md">
    <div className="mb-4">
      <h2 className="text-2xl font-bold">{data.fullName}</h2>
      <div className="flex flex-wrap gap-4 text-gray-600">
        {visibleFields.email && data.email && <span>{data.email}</span>}
        {visibleFields.phone && data.phone && <span>{data.phone}</span>}
        {visibleFields.location && data.location && <span>{data.location}</span>}
      </div>
    </div>
    {visibleFields.summary && data.summary && <div className="mb-4"><h3 className="font-semibold">Summary</h3><p>{data.summary}</p></div>}
    <div className="border-l-4 border-blue-400 pl-6 relative">
      {visibleFields.experience && Array.isArray(data.experience) && data.experience.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Experience</h3>
          <ul className="space-y-6">
            {data.experience.map((exp, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-7 top-2 w-4 h-4 bg-blue-400 rounded-full border-2 border-white"></span>
                <b>{exp.position}</b> at {exp.company} <span className="text-xs text-gray-500">({exp.duration})</span><br/>{exp.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      {visibleFields.education && Array.isArray(data.education) && data.education.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Education</h3>
          <ul className="space-y-6">
            {data.education.map((edu, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-7 top-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
                <b>{edu.degree}</b> at {edu.school} ({edu.year}){edu.grade && ` - ${edu.grade}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    <RenderAllFields data={data} visibleFields={{...visibleFields, experience: false, education: false}} />
  </div>
);

// 5. Minimalist Left-Aligned Template
const MinimalistLeftAlignedTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="bg-gray-50 border-l-8 border-black p-8 min-h-[500px] font-sans">
    {visibleFields.fullName && <h2 className="text-2xl font-bold mb-2">{data.fullName}</h2>}
    <div className="text-xs text-gray-600 mb-4">
      {visibleFields.email && data.email && <span>{data.email} </span>}
      {visibleFields.phone && data.phone && <span>| {data.phone} </span>}
      {visibleFields.location && data.location && <span>| {data.location}</span>}
    </div>
    {visibleFields.summary && data.summary && <div className="mb-4"><h3 className="font-semibold">Summary</h3><p>{data.summary}</p></div>}
    {visibleFields.experience && Array.isArray(data.experience) && data.experience.length > 0 && (
      <div className="mb-4">
        <h3 className="font-semibold">Experience</h3>
        <ul className="list-none ml-0">
          {data.experience.map((exp, i) => (
            <li key={i} className="mb-2 pl-2 border-l-2 border-black">
              <b>{exp.position}</b> at {exp.company} <span className="text-xs text-gray-500">({exp.duration})</span><br/>
              <span className="text-sm">{exp.description}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
    {visibleFields.skills && Array.isArray(data.skills) && data.skills.length > 0 && (
      <div className="mb-4">
        <h3 className="font-semibold">Skills</h3>
        <div className="flex flex-wrap gap-2">{data.skills.map((skill, i) => <span key={i} className="bg-black text-white px-2 py-1 rounded text-xs">{skill}</span>)}</div>
      </div>
    )}
    {visibleFields.education && Array.isArray(data.education) && data.education.length > 0 && (
      <div className="mb-4">
        <h3 className="font-semibold">Education</h3>
        <ul className="list-none ml-0">
          {data.education.map((edu, i) => (
            <li key={i} className="mb-1 pl-2 border-l-2 border-black"><b>{edu.degree}</b> at {edu.school} ({edu.year}){edu.grade && ` - ${edu.grade}`}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// Register new templates for preview rendering
// --- NEW DISTINCT TEMPLATES ---
// SplitColumns
const SplitColumnsTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="flex bg-white rounded-xl shadow-lg overflow-hidden min-h-[500px]">
    <div className="w-1/3 bg-gray-200 p-6 flex flex-col gap-4 border-r-2 border-gray-200">
      {visibleFields.fullName && <h2 className="text-lg font-bold mb-2">{data.fullName}</h2>}
      {visibleFields.email && <div className="text-xs">{data.email}</div>}
      {visibleFields.phone && <div className="text-xs">{data.phone}</div>}
      {visibleFields.location && <div className="text-xs">{data.location}</div>}
      {visibleFields.skills && Array.isArray(data.skills) && data.skills.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-1">Skills</h3>
          <ul className="list-disc ml-4 text-xs space-y-1">{data.skills.map((skill, i) => <li key={i}>{skill}</li>)}</ul>
        </div>
      )}
      {visibleFields.languages && Array.isArray(data.languages) && data.languages.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-1">Languages</h3>
          <ul className="list-disc ml-4 text-xs space-y-1">{data.languages.map((lang, i) => <li key={i}>{lang}</li>)}</ul>
        </div>
      )}
    </div>
    <div className="w-2/3 p-8">
      {visibleFields.summary && data.summary && <div className="mb-4"><h3 className="font-bold text-lg">Summary</h3><p>{data.summary}</p></div>}
      {visibleFields.experience && Array.isArray(data.experience) && data.experience.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold text-lg">Experience</h3>
          <ul className="space-y-2">{data.experience.map((exp, i) => (
            <li key={i}><b>{exp.position}</b> at {exp.company} <span className="text-xs text-gray-500">({exp.duration})</span><br/>{exp.description}</li>
          ))}</ul>
        </div>
      )}
      {visibleFields.education && Array.isArray(data.education) && data.education.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold text-lg">Education</h3>
          <ul className="space-y-1">{data.education.map((edu, i) => (
            <li key={i}><b>{edu.degree}</b> at {edu.school} ({edu.year}){edu.grade && ` - ${edu.grade}`}</li>
          ))}</ul>
        </div>
      )}
      {visibleFields.projects && Array.isArray(data.projects) && data.projects.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold text-lg">Projects</h3>
          <ul className="space-y-1">{data.projects.map((proj, i) => (
            <li key={i}><b>{proj.name}</b>: {proj.description} <span className="text-xs text-gray-500">[{proj.technologies}]</span> {proj.link && <a href={proj.link} className="text-blue-600 underline ml-2">Link</a>}</li>
          ))}</ul>
        </div>
      )}
    </div>
  </div>
)

// HeaderAccent
const HeaderAccentTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl text-white">
    <div className="text-2xl font-bold mb-1">{data.fullName}</div>
    <div className="flex flex-wrap gap-4 text-sm mb-2">
      {visibleFields.email && data.email && <span>{data.email}</span>}
      {visibleFields.phone && data.phone && <span>{data.phone}</span>}
      {visibleFields.location && data.location && <span>{data.location}</span>}
    </div>
    <div className="bg-white text-gray-900 p-6 rounded-b-xl -mt-2">
      <RenderAllFields data={data} visibleFields={visibleFields} />
    </div>
  </div>
);

// SidebarPhoto
const SidebarPhotoTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="flex bg-white rounded-xl shadow-lg overflow-hidden min-h-[500px]">
    <div className="w-1/4 bg-gray-200 p-6 flex flex-col items-center gap-4">
      <div className="w-24 h-24 bg-gray-400 rounded-full mb-2"></div>
      {visibleFields.fullName && <h2 className="text-lg font-bold mb-2 text-center">{data.fullName}</h2>}
      {visibleFields.email && <div className="text-xs text-center">{data.email}</div>}
      {visibleFields.phone && <div className="text-xs text-center">{data.phone}</div>}
      {visibleFields.location && <div className="text-xs text-center">{data.location}</div>}
      {visibleFields.skills && Array.isArray(data.skills) && data.skills.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-1 text-center">Skills</h3>
          <ul className="list-disc ml-4 text-xs space-y-1">{data.skills.map((skill, i) => <li key={i}>{skill}</li>)}</ul>
        </div>
      )}
    </div>
    <div className="w-3/4 p-8">
      <RenderAllFields data={data} visibleFields={visibleFields} />
    </div>
  </div>
)

// SectionTabs
const SectionTabsTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => {
  const [tab, setTab] = React.useState<'summary'|'experience'|'education'|'skills'|'projects'>('summary');
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex gap-2 mb-4">
        {['summary','experience','education','skills','projects'].map(t => (
          <button key={t} onClick={()=>setTab(t as any)} className={`px-3 py-1 rounded ${tab===t?'bg-blue-500 text-white':'bg-gray-100 text-gray-700'}`}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>
      {tab==='summary' && visibleFields.summary && <div><h3 className="font-bold text-lg mb-2">Summary</h3><p>{data.summary}</p></div>}
      {tab==='experience' && visibleFields.experience && Array.isArray(data.experience) && data.experience.length>0 && (
        <div><h3 className="font-bold text-lg mb-2">Experience</h3><ul className="list-disc ml-6">{data.experience.map((exp,i)=>(<li key={i}><b>{exp.position}</b> at {exp.company} ({exp.duration})<br/>{exp.description}</li>))}</ul></div>
      )}
      {tab==='education' && visibleFields.education && Array.isArray(data.education) && data.education.length>0 && (
        <div><h3 className="font-bold text-lg mb-2">Education</h3><ul className="list-disc ml-6">{data.education.map((edu,i)=>(<li key={i}><b>{edu.degree}</b> at {edu.school} ({edu.year}){edu.grade && ` - ${edu.grade}`}</li>))}</ul></div>
      )}
      {tab==='skills' && visibleFields.skills && Array.isArray(data.skills) && data.skills.length>0 && (
        <div><h3 className="font-bold text-lg mb-2">Skills</h3><div className="flex flex-wrap gap-2">{data.skills.map((skill,i)=>(<span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{skill}</span>))}</div></div>
      )}
      {tab==='projects' && visibleFields.projects && Array.isArray(data.projects) && data.projects.length>0 && (
        <div><h3 className="font-bold text-lg mb-2">Projects</h3><ul className="list-disc ml-6">{data.projects.map((proj,i)=>(<li key={i}><b>{proj.name}</b>: {proj.description} <span className="text-xs text-gray-500">[{proj.technologies}]</span> {proj.link && <a href={proj.link} className="text-blue-600 underline ml-2">Link</a>}</li>))}</ul></div>
      )}
    </div>
  );
}

// BoxedSections
const BoxedSectionsTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="bg-gray-50 p-8 rounded-xl grid gap-4">
    {visibleFields.summary && data.summary && <div className="bg-white p-4 rounded shadow"><h3 className="font-bold mb-1">Summary</h3><p>{data.summary}</p></div>}
    {visibleFields.experience && Array.isArray(data.experience) && data.experience.length>0 && <div className="bg-white p-4 rounded shadow"><h3 className="font-bold mb-1">Experience</h3><ul className="list-disc ml-6">{data.experience.map((exp,i)=>(<li key={i}><b>{exp.position}</b> at {exp.company} ({exp.duration})<br/>{exp.description}</li>))}</ul></div>}
    {visibleFields.education && Array.isArray(data.education) && data.education.length>0 && <div className="bg-white p-4 rounded shadow"><h3 className="font-bold mb-1">Education</h3><ul className="list-disc ml-6">{data.education.map((edu,i)=>(<li key={i}><b>{edu.degree}</b> at {edu.school} ({edu.year}){edu.grade && ` - ${edu.grade}`}</li>))}</ul></div>}
    {visibleFields.skills && Array.isArray(data.skills) && data.skills.length>0 && <div className="bg-white p-4 rounded shadow"><h3 className="font-bold mb-1">Skills</h3><div className="flex flex-wrap gap-2">{data.skills.map((skill,i)=>(<span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{skill}</span>))}</div></div>}
    {visibleFields.projects && Array.isArray(data.projects) && data.projects.length>0 && <div className="bg-white p-4 rounded shadow"><h3 className="font-bold mb-1">Projects</h3><ul className="list-disc ml-6">{data.projects.map((proj,i)=>(<li key={i}><b>{proj.name}</b>: {proj.description} <span className="text-xs text-gray-500">[{proj.technologies}]</span> {proj.link && <a href={proj.link} className="text-blue-600 underline ml-2">Link</a>}</li>))}</ul></div>}
  </div>
)

// DiagonalAccent
const DiagonalAccentTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="absolute -top-10 -left-10 w-1/2 h-32 bg-gradient-to-tr from-pink-500 to-yellow-400 transform -rotate-12 z-0"></div>
    <div className="relative z-10 p-8">
      <h2 className="text-2xl font-bold mb-2">{data.fullName}</h2>
      <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
        {visibleFields.email && data.email && <span>{data.email}</span>}
        {visibleFields.phone && data.phone && <span>{data.phone}</span>}
        {visibleFields.location && data.location && <span>{data.location}</span>}
      </div>
      <RenderAllFields data={data} visibleFields={visibleFields} />
    </div>
  </div>
)
// LeftAccentBar
const LeftAccentBarTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="flex bg-white rounded-xl shadow-lg overflow-hidden min-h-[500px]">
    <div className="w-2 bg-blue-600"></div>
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-2">{data.fullName}</h2>
      <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
        {visibleFields.email && data.email && <span>{data.email}</span>}
        {visibleFields.phone && data.phone && <span>{data.phone}</span>}
        {visibleFields.location && data.location && <span>{data.location}</span>}
      </div>
      <RenderAllFields data={data} visibleFields={visibleFields} />
    </div>
  </div>
)
// CompactGrid
const CompactGridTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 gap-4 text-xs">
    <div>
      {visibleFields.fullName && <div className="font-bold text-base mb-1">{data.fullName}</div>}
      {visibleFields.email && <div>{data.email}</div>}
      {visibleFields.phone && <div>{data.phone}</div>}
      {visibleFields.location && <div>{data.location}</div>}
      {visibleFields.skills && Array.isArray(data.skills) && data.skills.length>0 && <div className="mt-2"><b>Skills:</b> {data.skills.join(', ')}</div>}
      {visibleFields.languages && Array.isArray(data.languages) && data.languages.length>0 && <div className="mt-2"><b>Languages:</b> {data.languages.join(', ')}</div>}
    </div>
    <div>
      {visibleFields.summary && <div className="mb-2"><b>Summary:</b> {data.summary}</div>}
      {visibleFields.experience && Array.isArray(data.experience) && data.experience.length>0 && <div className="mb-2"><b>Experience:</b> {data.experience[0].position} at {data.experience[0].company}</div>}
      {visibleFields.education && Array.isArray(data.education) && data.education.length>0 && <div className="mb-2"><b>Education:</b> {data.education[0].degree} at {data.education[0].school}</div>}
      {visibleFields.projects && Array.isArray(data.projects) && data.projects.length>0 && <div className="mb-2"><b>Projects:</b> {data.projects[0].name}</div>}
    </div>
  </div>
)
// --- END NEW DISTINCT TEMPLATES ---

const TEMPLATE_COMPONENTS: Record<string, React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }>> = {
  universal: UniversalTemplate,
  "test-template": TestTemplate,
  "modern-blue": ModernBlueTemplate,
  "classic-elegance": ClassicEleganceTemplate,
  "creative-gradient": CreativeGradientTemplate,
  "professional-gray": ProfessionalGrayTemplate,
  "tech-circuit": TechCircuitTemplate,
  "elegant-gold": ElegantGoldTemplate,
  "bold-red": BoldRedTemplate,
  "soft-pastel": SoftPastelTemplate,
  "geometric-blocks": GeometricBlocksTemplate,
  "mono-space": MonoSpaceTemplate,
  "sleek-black": MinimalistBlackTemplate,
  "pastel-wave": SoftPastelTemplate,
  "sidebar-accent": SidebarLeftTemplate,
  "royal-blue": ModernBlueTemplate,
  "circuit-tech": TechCircuitTemplate,
  "elegant-purple": ElegantGoldTemplate,
  "green-minimal": MinimalistLeftAlignedTemplate,
  "orange-sidebar": SidebarLeftTemplate,
  "split-columns": SplitColumnsTemplate,
  "header-accent": HeaderAccentTemplate,
  "timeline": TimelineTemplate,
  "sidebar-photo": SidebarPhotoTemplate,
  "section-tabs": SectionTabsTemplate,
  "diagonal-accent": DiagonalAccentTemplate,
  "boxed-sections": BoxedSectionsTemplate,
  "left-accent-bar": LeftAccentBarTemplate,
  "compact-grid": CompactGridTemplate,
  "sidebar-left": SidebarLeftTemplate,
  "two-column-split": TwoColumnSplitTemplate,
};

export const ResumePreview: React.FC<ResumePreviewProps & { visibleFields: Record<string, boolean> }> = ({ data, template, visibleFields }) => {
  const TemplateComponent = TEMPLATE_COMPONENTS[template] || UniversalTemplate;
  return (
    <div className="w-full h-full bg-white">
      <TemplateComponent data={data} visibleFields={visibleFields} />
    </div>
  );
};

// Use inline template components as defined in this file

// --- NEW DISTINCT TEMPLATES ---
// SplitColumns

// HeaderAccent

// SidebarPhoto

// SectionTabs

// DiagonalAccent

// BoxedSections

// LeftAccentBar

// CompactGrid

// --- END NEW DISTINCT TEMPLATES ---

export {
  SplitColumnsTemplate,
  HeaderAccentTemplate,
  SidebarPhotoTemplate,
  SectionTabsTemplate,
  DiagonalAccentTemplate,
  BoxedSectionsTemplate,
  LeftAccentBarTemplate,
  CompactGridTemplate
};