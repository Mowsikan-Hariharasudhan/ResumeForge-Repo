import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Template } from "@/types/templates";
import { ResumeData } from "@/types/resume";
import { TemplateRenderer } from "./TemplateRenderer";

interface TemplateCardProps {
  template: Template;
  onSelect?: (templateId: string) => void;
  onUse?: (templateId: string) => void;
  showUseButton?: boolean;
  isSelected?: boolean;
  resumeData?: ResumeData;
  className?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  onUse,
  showUseButton = true,
  isSelected = false,
  resumeData,
  className = "",
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(template.id);
    }
  };

  const handleUse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUse) {
      onUse(template.id);
    }
  };

  return (
    <div className={`group cursor-pointer ${className}`} onClick={handleClick}>
      {/* Template Preview */}
      <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="aspect-[3/4] relative overflow-hidden bg-white">
          {/* Full Template Preview - exactly like screenshot */}
          <div className="absolute inset-0 p-2">
            <div className="w-full h-full transform scale-[0.85] origin-top-left">
              <div className="w-[117%] h-[117%] bg-white">
                <TemplateRenderer
                  templateId={template.id}
                  resumeData={resumeData}
                />
              </div>
            </div>
          </div>

          {/* Hover Overlay */}
          {showUseButton && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <Button
                onClick={handleUse}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Use this template
              </Button>
            </div>
          )}

          {/* Selected indicator */}
          {isSelected && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-blue-500 text-white text-xs">Selected</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Template Info - Clean layout like screenshot */}
      <div className="mt-4 text-center">
        <h3 className="font-semibold text-gray-900 text-lg mb-2">
          {template.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
          {template.description}
        </p>
      </div>
    </div>
  );
};
