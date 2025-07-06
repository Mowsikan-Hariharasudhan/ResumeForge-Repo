import { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Download,
  Save,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ResumePreview } from '@/components/ResumePreview';
import { ResumeData } from '@/types/resume';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  template: string;
  visibleFields: Record<string, boolean>;
  templateDisplayName: string;
  onDownload: () => void;
  onSave: () => void;
  isDownloading?: boolean;
  isSaving?: boolean;
  canDownload?: boolean;
  userDisplayName?: string;
}

export const ResumePreviewModal = ({
  isOpen,
  onClose,
  data,
  template,
  visibleFields,
  templateDisplayName,
  onDownload,
  onSave,
  isDownloading = false,
  isSaving = false,
  canDownload = true,
  userDisplayName = "Resume Preview"
}: ResumePreviewModalProps) => {
  const [zoom, setZoom] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const resetZoom = () => setZoom(isMobile ? 0.75 : 0.8);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setZoom(1.0);
    } else {
      setZoom(isMobile ? 0.75 : 0.8);
    }
  };

  // Calculate total pages based on content height
  useEffect(() => {
    if (previewRef.current && isOpen) {
      const contentHeight = previewRef.current.scrollHeight;
      const pageHeight = 297 * 3.78; // A4 height in pixels (297mm * 3.78)
      const calculatedPages = Math.ceil(contentHeight / pageHeight);
      setTotalPages(Math.max(1, calculatedPages));
    }
  }, [isOpen, data, template]);

  // Reset zoom and page when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setZoom(isMobile ? 0.75 : 0.8);
      setIsFullscreen(false);
      setCurrentPage(1);
    }
  }, [isOpen, isMobile]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            zoomIn();
            break;
          case '-':
            e.preventDefault();
            zoomOut();
            break;
          case '0':
            e.preventDefault();
            resetZoom();
            break;
        }
      }
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
      // Page navigation
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
      if (e.key === 'ArrowRight' && currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, currentPage, totalPages]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${
          isFullscreen 
            ? 'fixed inset-0 w-screen h-screen max-w-none max-h-none m-0 rounded-none' 
            : isMobile 
              ? 'w-[100vw] max-w-[100vw] h-[100vh] max-h-[100vh] m-0 rounded-none'
              : 'max-w-7xl w-[95vw] max-h-[95vh]'
        } p-0 overflow-hidden bg-gray-900`}
      >
        {/* Header with dark theme - inspired by your image */}
        <DialogHeader className={`${isMobile ? 'p-4' : 'p-6'} pb-4 border-b border-gray-700 bg-gray-900 sticky top-0 z-10`}>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Back/Edit button - mobile style */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-blue-400 hover:text-blue-300 hover:bg-gray-800 p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="ml-1 text-sm">Edit</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Download PDF Button - prominent like in your image */}
              <Button
                size={isMobile ? "sm" : "default"}
                onClick={onDownload}
                disabled={isDownloading || !canDownload}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-medium ${isMobile ? 'h-9 px-4' : ''}`}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download PDF
              </Button>

              {/* Three dots menu */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800 p-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </Button>

              {/* Settings/filter button like in your image */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800 p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Main content area with dark background like your image */}
        <div 
          className={`overflow-auto bg-gray-800 ${isMobile ? 'mobile-scroll' : ''}`}
          style={{ 
            height: isFullscreen 
              ? 'calc(100vh - 80px)' 
              : isMobile 
                ? 'calc(100vh - 80px)' 
                : 'calc(95vh - 120px)' 
          }}
        >
          <div className={`${isMobile ? 'p-4' : 'p-6'} flex justify-center items-start min-h-full`}>
            <div
              ref={previewRef}
              className="bg-white shadow-2xl transition-transform duration-200 relative"
              style={{
                width: isMobile ? "100%" : "210mm",
                minHeight: isMobile ? "calc(100vh - 200px)" : "297mm",
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                marginBottom: zoom < 0.6 ? "-200px" : "0",
                // Ensure proper aspect ratio for mobile
                aspectRatio: isMobile ? "210/297" : "auto",
                maxWidth: isMobile ? "100%" : "210mm",
              }}
            >
              {/* Watermarks - lighter for better visibility on dark background */}
              <div className="absolute inset-0 pointer-events-none z-5 flex items-center justify-center">
                <div
                  className="text-gray-300 text-6xl font-bold transform rotate-45 opacity-20 select-none"
                  style={{
                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                  }}
                >
                  PREVIEW
                </div>
              </div>

              <div className="absolute top-1/4 left-1/4 pointer-events-none z-5">
                <div className="text-gray-200 text-3xl font-bold transform rotate-45 opacity-15 select-none">
                  Resumify
                </div>
              </div>
              <div className="absolute bottom-1/4 right-1/4 pointer-events-none z-5">
                <div className="text-gray-200 text-3xl font-bold transform rotate-45 opacity-15 select-none">
                  Resumify
                </div>
              </div>

              <div className="resume-template-content relative z-10 w-full h-full">
                <ResumePreview
                  data={data}
                  template={template}
                  visibleFields={visibleFields}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating zoom controls - mobile friendly */}
        {isMobile && (
          <div className="fixed bottom-6 left-4 right-4 flex flex-col gap-3 items-center">
            {/* Page Navigation */}
            <ResumePageNavigation
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="bg-gray-700 rounded-full px-4 py-2 shadow-lg"
            />
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-gray-700 rounded-full px-4 py-2 shadow-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                disabled={zoom <= 0.3}
                className="h-8 w-8 p-0 text-white hover:bg-gray-600"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-white text-sm font-mono min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                disabled={zoom >= 2}
                className="h-8 w-8 p-0 text-white hover:bg-gray-600"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-gray-500 mx-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                className="h-8 w-8 p-0 text-white hover:bg-gray-600"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Desktop zoom controls */}
        {!isMobile && (
          <div className="absolute top-20 right-6 z-20 space-y-2">
            {/* Page Navigation */}
            <ResumePageNavigation
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="bg-gray-700 rounded-md p-2 shadow-lg"
            />
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-700 rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                disabled={zoom <= 0.3}
                className="h-7 w-7 p-0 text-white hover:bg-gray-600"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <span className="text-white text-xs font-mono min-w-[3rem] text-center px-2">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                disabled={zoom >= 2}
                className="h-7 w-7 p-0 text-white hover:bg-gray-600"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                className="h-7 w-7 p-0 text-white hover:bg-gray-600"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
              {!isFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="h-7 w-7 p-0 text-white hover:bg-gray-600"
                >
                  <Maximize2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Page Navigation Component
const ResumePageNavigation: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}> = ({ currentPage, totalPages, onPageChange, className = "" }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-8 w-8 p-0 text-white hover:bg-gray-600"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <span className="text-white text-sm font-mono min-w-[4rem] text-center">
        {currentPage} / {totalPages}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-8 w-8 p-0 text-white hover:bg-gray-600"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
