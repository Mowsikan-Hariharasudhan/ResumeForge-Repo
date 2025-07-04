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
      <DialogContent className="w-full max-w-6xl max-h-[90vh] p-0 sm:max-w-full sm:max-h-screen rounded-lg overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-2xl font-bold">
              Choose Template
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="min-w-[90px]"
            >
              All Templates
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="min-w-[90px]"
              >
                {category}
              </Button>
            ))}
          </div>
        </DialogHeader>

        <div className="px-2 sm:px-6 pb-4 sm:pb-6 overflow-y-auto max-h-[60vh] sm:max-h-[70vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleSelectTemplate}
                isSelected={currentTemplateId === template.id}
                resumeData={resumeData}
                className="max-w-full border-2 border-transparent group-hover:border-blue-400 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
