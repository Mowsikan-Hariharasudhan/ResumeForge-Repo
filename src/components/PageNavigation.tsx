import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

interface ResumePageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const ResumePageNavigation = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: ResumePageNavigationProps) => {
  if (totalPages <= 1) return null;

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
        <FileText className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
