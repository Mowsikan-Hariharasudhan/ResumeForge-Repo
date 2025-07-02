import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { generatePDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';

interface PDFDownloadButtonProps {
  elementRef: React.RefObject<HTMLElement>;
  filename?: string;
  disabled?: boolean;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onDownloadError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
}

export const PDFDownloadButton = ({
  elementRef,
  filename = 'resume.pdf',
  disabled = false,
  onDownloadStart,
  onDownloadComplete,
  onDownloadError,
  className,
  children
}: PDFDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return interval;
  };

  const handleDownload = async () => {
    if (!elementRef.current || disabled) return;

    setIsDownloading(true);
    setStatus('downloading');
    onDownloadStart?.();

    const progressInterval = simulateProgress();

    try {
      // Add a small delay to show the progress animation
      await new Promise(resolve => setTimeout(resolve, 1000));

      await generatePDF(elementRef.current, { filename });

      clearInterval(progressInterval);
      setProgress(100);
      setStatus('success');

      toast({
        title: "Success!",
        description: "Your resume has been downloaded successfully.",
      });

      onDownloadComplete?.();

      // Reset status after a delay
      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
      }, 2000);

    } catch (error) {
      clearInterval(progressInterval);
      setStatus('error');
      
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
      });

      onDownloadError?.(error instanceof Error ? error : new Error('Download failed'));

      // Reset status after a delay
      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
      }, 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'downloading':
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating PDF...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Downloaded!
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
            Try Again
          </>
        );
      default:
        return children || (
          <>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </>
        );
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleDownload}
        disabled={disabled || isDownloading}
        className={className}
      >
        {getButtonContent()}
      </Button>
      
      {isDownloading && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Generating PDF...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      )}
    </div>
  );
};