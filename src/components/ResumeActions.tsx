import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Download, Palette } from "lucide-react";
import { getTemplateById } from "@/types/templates";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResumeActionsProps {
  currentTemplate: string;
  onTemplateChange: (templateId: string) => void;
  onSave: () => void;
  onDownload: () => void;
  onOpenTemplateSelector: () => void;
  isSaving?: boolean;
  title: string;
  onTitleChange: (title: string) => void;
}

export const ResumeActions = ({
  currentTemplate,
  onTemplateChange,
  onSave,
  onDownload,
  onOpenTemplateSelector,
  isSaving = false,
  title,
  onTitleChange,
}: ResumeActionsProps) => {
  const currentTemplateData = getTemplateById(currentTemplate);
  const isMobile = useIsMobile();

  return (
    <div className={`space-y-4 ${isMobile ? 'p-4' : ''}`}>
      <div>
        <Label
          htmlFor="resume-title"
          className="text-sm font-medium text-gray-700"
        >
          Resume Title
        </Label>
        <Input
          id="resume-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`mt-1 ${isMobile ? 'h-12' : ''}`}
          placeholder="Enter resume title"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">Template</Label>
        <Button
          onClick={onOpenTemplateSelector}
          variant="outline"
          className={`w-full mt-1 justify-start ${isMobile ? 'h-12' : ''}`}
        >
          <Palette className="w-4 h-4 mr-2" />
          {currentTemplateData?.name || "Modern Classic"}
          <span className="ml-auto text-xs text-gray-500">Change</span>
        </Button>
      </div>

      <div className={`flex gap-2 ${isMobile ? 'flex-col' : ''}`}>
        <Button
          onClick={onSave}
          disabled={isSaving}
          className={`${isMobile ? 'w-full h-12' : 'flex-1'} bg-gradient-primary hover:opacity-90`}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Resume"}
        </Button>

        <Button 
          onClick={onDownload} 
          variant="outline" 
          className={`${isMobile ? 'w-full h-12' : 'flex-1'}`}
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};
