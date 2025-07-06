import { useState, useRef, useEffect } from 'react';
import { ResumePreview } from '@/components/ResumePreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedResumePreviewProps {
  data: ResumeData;
  template: string;
  className?: string;
  visibleFields: Record<string, boolean>;
}

export const EnhancedResumePreview = ({ 
  data, 
  template, 
  className, 
  visibleFields 
}: EnhancedResumePreviewProps) => {
  const [zoom, setZoom] = useState(0.6);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const resetZoom = () => setZoom(isMobile ? 0.4 : 0.6);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setZoom(isMobile ? 0.5 : 0.8);
    } else {
      setZoom(isMobile ? 0.4 : 0.6);
    }
  };

  // Set initial zoom based on device
  useEffect(() => {
    setZoom(isMobile ? 0.4 : 0.6);
  }, [isMobile]);

  // Handle keyboard shortcuts
  useEffect(() => {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const getTemplateDisplayName = (templateId: string) => {
    const templates: Record<string, string> = {
      modern: 'Modern Professional',
      professional: 'Professional Elite',
      sidebar: 'Sidebar Professional',
      recruiter: 'Recruiter Focused',
      creative: 'Creative Designer',
      executive: 'Executive',
      minimal: 'Minimal',
      technical: 'Technical'
    };
    return templates[templateId] || 'Modern Professional';
  };

  return (
    <div 
      ref={containerRef}
      className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}
    >
      <Card className="h-full">
        <CardHeader className={`${isMobile ? 'pb-2' : 'pb-3'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>
                {isMobile ? 'Preview' : 'Live Preview'}
              </CardTitle>
              {!isMobile && (
                <Badge variant="outline" className="text-xs">
                  {getTemplateDisplayName(template)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <div className={`flex items-center gap-1 border rounded-md p-1 ${isMobile ? 'scale-90' : ''}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomOut}
                  disabled={zoom <= 0.3}
                  className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} p-0`}
                >
                  <ZoomOut className={`${isMobile ? 'w-3 h-3' : 'w-3 h-3'}`} />
                </Button>
                <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-mono ${isMobile ? 'min-w-[2.5rem]' : 'min-w-[3rem]'} text-center`}>
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomIn}
                  disabled={zoom >= 2}
                  className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} p-0`}
                >
                  <ZoomIn className={`${isMobile ? 'w-3 h-3' : 'w-3 h-3'}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetZoom}
                  className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} p-0`}
                >
                  <RotateCcw className={`${isMobile ? 'w-3 h-3' : 'w-3 h-3'}`} />
                </Button>
              </div>
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="h-7 w-7 p-0"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3 h-3" />
                  ) : (
                    <Maximize2 className="w-3 h-3" />
                  )}
                </Button>
              )}
            </div>
          </div>
          
          {/* Mobile template badge */}
          {isMobile && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {getTemplateDisplayName(template)}
              </Badge>
            </div>
          )}
        </CardHeader>
        <div
          ref={previewRef}
          className={`relative bg-gray-100 flex justify-center items-center overflow-auto ${isMobile ? 'mobile-scroll' : ''}`}
          style={{ 
            height: isFullscreen 
              ? 'calc(100vh - 60px)' 
              : isMobile 
                ? 'calc(100vh - 160px)' 
                : '600px' 
          }}
        >
          <div
            className="transition-transform duration-200"
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: isMobile ? 'top left' : 'top center', 
              width: isMobile ? '100%' : 'auto' 
            }}
          >
            <ResumePreview data={data} template={template} visibleFields={visibleFields} />
          </div>
        </div>
      </Card>
    </div>
  );
};