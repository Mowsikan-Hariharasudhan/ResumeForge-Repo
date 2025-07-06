import React from "react";
import { ResumeData } from "@/types/resume";
import { TemplateRendererProps } from "@/types/templates";
import { ResponsiveTemplate } from "./ResponsiveTemplate";
import {
  RenderAllFields,
  SplitColumnsTemplate,
  HeaderAccentTemplate,
  TimelineTemplate as TimelineDistinctTemplate,
  SidebarPhotoTemplate,
  SectionTabsTemplate,
  DiagonalAccentTemplate,
  BoxedSectionsTemplate,
  LeftAccentBarTemplate,
  CompactGridTemplate,
} from "./ResumePreview";

// Template components for each templateId
const UniversalTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-white">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const ModernBlueTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-blue-50 border-l-8 border-blue-400">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const ClassicEleganceTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-serif bg-white border border-gray-300 rounded-lg">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const CreativeGradientTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const ProfessionalGrayTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-gray-100 border-l-8 border-gray-400">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const TechCircuitTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-mono bg-gray-900 text-green-300 border-l-8 border-green-400">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const ElegantGoldTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-serif bg-white border-t-8 border-yellow-500">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const BoldRedTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-white border-l-8 border-red-500">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const SoftPastelTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-pink-50 rounded-2xl">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const GeometricBlocksTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-white">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RenderAllFields data={data} visibleFields={visibleFields} />
    </div>
  </ResponsiveTemplate>
);
const MonoSpaceTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-mono bg-gray-800 text-white">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const SleekBlackTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-black text-white">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const PastelWaveTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-gradient-to-br from-pink-100 to-blue-100 rounded-2xl">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const SidebarAccentTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-white">
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 bg-blue-200 p-4 mb-4 md:mb-0">
        <div className="font-bold">Contact</div>
        <div>{data.email}</div>
        <div>{data.phone}</div>
        <div>{data.location}</div>
      </div>
      <div className="w-full md:w-3/4 p-4">
        <RenderAllFields data={data} visibleFields={visibleFields} />
      </div>
    </div>
  </ResponsiveTemplate>
);
const RoyalBlueTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-blue-100 border-l-8 border-blue-700">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const CircuitTechTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-mono bg-gray-900 text-cyan-300 border-l-8 border-cyan-400">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const ElegantPurpleTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-serif bg-purple-50 border-t-8 border-purple-400">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const GreenMinimalTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-green-50 border-l-8 border-green-400">
    <RenderAllFields data={data} visibleFields={visibleFields} />
  </ResponsiveTemplate>
);
const OrangeSidebarTemplate: React.FC<{ data: ResumeData; visibleFields: Record<string, boolean> }> = ({ data, visibleFields }) => (
  <ResponsiveTemplate data={data} className="text-xs font-sans bg-white">
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 bg-orange-200 p-4 mb-4 md:mb-0">
        <div className="font-bold">Contact</div>
        <div>{data.email}</div>
        <div>{data.phone}</div>
        <div>{data.location}</div>
      </div>
      <div className="w-full md:w-3/4 p-4">
        <RenderAllFields data={data} visibleFields={visibleFields} />
      </div>
    </div>
  </ResponsiveTemplate>
);

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  templateId,
  resumeData,
  visibleFields,
}) => {
  const renderTemplate = () => {
    switch (templateId) {
      case "universal":
        return <UniversalTemplate data={resumeData} visibleFields={visibleFields} />;
      case "modern-blue":
        return <ModernBlueTemplate data={resumeData} visibleFields={visibleFields} />;
      case "classic-elegance":
        return <ClassicEleganceTemplate data={resumeData} visibleFields={visibleFields} />;
      case "creative-gradient":
        return <CreativeGradientTemplate data={resumeData} visibleFields={visibleFields} />;
      case "professional-gray":
        return <ProfessionalGrayTemplate data={resumeData} visibleFields={visibleFields} />;
      case "tech-circuit":
        return <TechCircuitTemplate data={resumeData} visibleFields={visibleFields} />;
      case "elegant-gold":
        return <ElegantGoldTemplate data={resumeData} visibleFields={visibleFields} />;
      case "bold-red":
        return <BoldRedTemplate data={resumeData} visibleFields={visibleFields} />;
      case "soft-pastel":
        return <SoftPastelTemplate data={resumeData} visibleFields={visibleFields} />;
      case "geometric-blocks":
        return <GeometricBlocksTemplate data={resumeData} visibleFields={visibleFields} />;
      case "mono-space":
        return <MonoSpaceTemplate data={resumeData} visibleFields={visibleFields} />;
      case "sleek-black":
        return <SleekBlackTemplate data={resumeData} visibleFields={visibleFields} />;
      case "pastel-wave":
        return <PastelWaveTemplate data={resumeData} visibleFields={visibleFields} />;
      case "sidebar-accent":
        return <SidebarAccentTemplate data={resumeData} visibleFields={visibleFields} />;
      case "royal-blue":
        return <RoyalBlueTemplate data={resumeData} visibleFields={visibleFields} />;
      case "circuit-tech":
        return <CircuitTechTemplate data={resumeData} visibleFields={visibleFields} />;
      case "elegant-purple":
        return <ElegantPurpleTemplate data={resumeData} visibleFields={visibleFields} />;
      case "green-minimal":
        return <GreenMinimalTemplate data={resumeData} visibleFields={visibleFields} />;
      case "orange-sidebar":
        return <OrangeSidebarTemplate data={resumeData} visibleFields={visibleFields} />;
      case "split-columns":
        return <SplitColumnsTemplate data={resumeData} visibleFields={visibleFields} />;
      case "header-accent":
        return <HeaderAccentTemplate data={resumeData} visibleFields={visibleFields} />;
      case "timeline":
        return <TimelineDistinctTemplate data={resumeData} visibleFields={visibleFields} />;
      case "sidebar-photo":
        return <SidebarPhotoTemplate data={resumeData} visibleFields={visibleFields} />;
      case "section-tabs":
        return <SectionTabsTemplate data={resumeData} visibleFields={visibleFields} />;
      case "diagonal-accent":
        return <DiagonalAccentTemplate data={resumeData} visibleFields={visibleFields} />;
      case "boxed-sections":
        return <BoxedSectionsTemplate data={resumeData} visibleFields={visibleFields} />;
      case "left-accent-bar":
        return <LeftAccentBarTemplate data={resumeData} visibleFields={visibleFields} />;
      case "compact-grid":
        return <CompactGridTemplate data={resumeData} visibleFields={visibleFields} />;
      default:
        return <UniversalTemplate data={resumeData} visibleFields={visibleFields} />;
    }
  };

  return (
    <div className={`w-full h-full bg-white overflow-hidden`}>
      {renderTemplate()}
    </div>
  );
};
