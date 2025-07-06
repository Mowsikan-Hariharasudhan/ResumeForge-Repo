import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import { TEMPLATES } from "@/types/templates";
import { ResumeData } from "@/types/resume";
import { useIsMobile } from "@/hooks/use-mobile";

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  currentTemplateId?: string;
  resumeData?: ResumeData;
}

const UNIVERSAL_TEMPLATE = {
  id: "universal",
  name: "Universal",
  description: "A universal template that shows all fields and supports field visibility toggling.",
  category: "Universal",
};

const ALL_TEMPLATES = [UNIVERSAL_TEMPLATE, ...TEMPLATES];

function getAllCategories(): string[] {
  // Get unique categories from ALL_TEMPLATES
  const categoriesSet = new Set<string>();
  ALL_TEMPLATES.forEach((template) => {
    if (template.category) {
      categoriesSet.add(template.category);
    }
  });
  return Array.from(categoriesSet);
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  currentTemplateId,
  resumeData,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const categories = getAllCategories();
  const filteredTemplates = selectedCategory
    ? ALL_TEMPLATES.filter((template) => template.category === selectedCategory)
    : ALL_TEMPLATES;

  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`w-full ${isMobile ? 'max-w-[98vw] max-h-[95vh] m-1' : 'max-w-6xl max-h-[90vh]'} p-0 rounded-lg overflow-hidden`}>
        <DialogHeader className={`${isMobile ? 'p-3 pb-2' : 'p-6 pb-4'} border-b`}>
          <div className="flex items-center justify-between">
            <DialogTitle className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
              Choose Template
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className={`rounded-full ${isMobile ? 'h-8 w-8' : 'h-10 w-10'}`}
            >
              <X className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </Button>
          </div>

          {/* Category Filter */}
          <div className={`flex flex-wrap gap-1 ${isMobile ? 'mt-3' : 'mt-4'}`}>
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={`${isMobile ? 'min-w-[60px] text-xs px-2 py-1 h-8' : 'min-w-[90px] text-sm px-3 py-2'}`}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`${isMobile ? 'min-w-[60px] text-xs px-2 py-1 h-8' : 'min-w-[90px] text-sm px-3 py-2'}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </DialogHeader>

        <div className={`${isMobile ? 'px-2 pb-3' : 'px-6 pb-6'} overflow-y-auto ${isMobile ? 'max-h-[75vh]' : 'max-h-[70vh]'} mobile-scroll`}>
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'}`}>
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleSelectTemplate}
                isSelected={currentTemplateId === template.id}
                resumeData={resumeData}
                className={`max-w-full border-2 border-transparent hover:border-blue-400 transition-all duration-300 ${isMobile ? 'mobile-card' : ''}`}
              />
            ))}
          </div>
          
          {/* Mobile-specific selected template indicator */}
          {isMobile && currentTemplateId && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">
                    Current
                  </Badge>
                  <span className="text-sm font-medium">
                    {ALL_TEMPLATES.find(t => t.id === currentTemplateId)?.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-xs"
                >
                  Keep Current
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
