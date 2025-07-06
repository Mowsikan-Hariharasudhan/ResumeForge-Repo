import React from 'react';
import { ResumeData } from '@/types/resume';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveTemplateProps {
  children: React.ReactNode;
  data: ResumeData;
  className?: string;
}

export const ResponsiveTemplate: React.FC<ResponsiveTemplateProps> = ({ 
  children, 
  data, 
  className = "" 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={`
        resume-template
        ${isMobile ? 'mobile-template' : 'desktop-template'}
        ${className}
      `}
      style={{
        // Ensure consistent A4 proportions
        width: '100%',
        minHeight: isMobile ? 'auto' : '297mm',
        maxWidth: isMobile ? '100%' : '210mm',
        // Mobile-specific adjustments
        fontSize: isMobile ? '12px' : '14px',
        lineHeight: isMobile ? '1.4' : '1.6',
        padding: isMobile ? '16px' : '24px',
        // Ensure proper rendering
        boxSizing: 'border-box',
        overflow: 'hidden',
        // A4 aspect ratio maintenance
        aspectRatio: isMobile ? '210/297' : 'auto',
      }}
    >
      {children}
    </div>
  );
};

// Mobile-optimized field renderer
export const MobileField: React.FC<{
  label: string;
  value: string | string[];
  className?: string;
  isVisible?: boolean;
}> = ({ label, value, className = "", isVisible = true }) => {
  const isMobile = useIsMobile();
  
  if (!isVisible || !value || (Array.isArray(value) && value.length === 0)) {
    return null;
  }
  
  return (
    <div className={`mobile-field ${className}`}>
      <h3 
        className="field-label font-semibold text-gray-700 mb-1"
        style={{
          fontSize: isMobile ? '14px' : '16px',
          marginBottom: isMobile ? '4px' : '8px',
        }}
      >
        {label}
      </h3>
      <div 
        className="field-content text-gray-600"
        style={{
          fontSize: isMobile ? '12px' : '14px',
          lineHeight: isMobile ? '1.4' : '1.6',
        }}
      >
        {Array.isArray(value) ? value.join(', ') : value}
      </div>
    </div>
  );
};

// Mobile-optimized section renderer
export const MobileSection: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={`mobile-section ${className}`}
      style={{
        marginBottom: isMobile ? '16px' : '24px',
      }}
    >
      <h2 
        className="section-title font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3"
        style={{
          fontSize: isMobile ? '16px' : '18px',
          marginBottom: isMobile ? '8px' : '12px',
        }}
      >
        {title}
      </h2>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
};

// Mobile-optimized experience/education item
export const MobileExperienceItem: React.FC<{
  title: string;
  company: string;
  duration: string;
  description: string;
  className?: string;
}> = ({ title, company, duration, description, className = "" }) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={`mobile-experience-item ${className}`}
      style={{
        marginBottom: isMobile ? '12px' : '16px',
        paddingBottom: isMobile ? '8px' : '12px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <h4 
          className="font-semibold text-gray-800"
          style={{
            fontSize: isMobile ? '14px' : '16px',
          }}
        >
          {title}
        </h4>
        <span 
          className="text-gray-600 text-sm"
          style={{
            fontSize: isMobile ? '11px' : '13px',
          }}
        >
          {duration}
        </span>
      </div>
      <p 
        className="text-gray-700 font-medium mb-1"
        style={{
          fontSize: isMobile ? '12px' : '14px',
        }}
      >
        {company}
      </p>
      <p 
        className="text-gray-600"
        style={{
          fontSize: isMobile ? '11px' : '13px',
          lineHeight: isMobile ? '1.4' : '1.6',
        }}
      >
        {description}
      </p>
    </div>
  );
};
