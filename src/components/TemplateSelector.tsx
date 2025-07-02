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
import { TEMPLATES, getAllCategories } from "@/types/templates";
import { ResumeData } from "@/types/resume";

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  currentTemplateId?: string;
  resumeData?: ResumeData;
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
    ? TEMPLATES.filter((template) => template.category === selectedCategory)
    : TEMPLATES;

  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Choose Template
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Templates
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleSelectTemplate}
                isSelected={currentTemplateId === template.id}
                resumeData={resumeData}
                className="max-w-sm"
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
