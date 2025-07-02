import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Resume Builder!',
    content: 'Let\'s take a quick tour to help you create an amazing resume. This will only take a minute.',
  },
  {
    id: 'template',
    title: 'Choose Your Template',
    content: 'Start by selecting a professional template that matches your style and industry.',
    target: '[data-tour="template-selector"]',
  },
  {
    id: 'personal',
    title: 'Add Personal Information',
    content: 'Fill in your basic details like name, email, and contact information.',
    target: '[data-tour="personal-tab"]',
  },
  {
    id: 'experience',
    title: 'Add Work Experience',
    content: 'Include your work history with detailed descriptions of your achievements.',
    target: '[data-tour="experience-tab"]',
  },
  {
    id: 'preview',
    title: 'Live Preview',
    content: 'See your resume update in real-time as you make changes. You can zoom and adjust the view.',
    target: '[data-tour="preview-panel"]',
  },
  {
    id: 'download',
    title: 'Download Your Resume',
    content: 'When you\'re ready, download your resume as a high-quality PDF.',
    target: '[data-tour="download-button"]',
  },
];

interface ResumeBuilderTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeBuilderTour = ({ isOpen, onClose }: ResumeBuilderTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
    localStorage.setItem('resume-builder-tour-completed', 'true');
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isVisible) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <CardTitle className="text-lg">{currentTourStep.title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Step {currentStep + 1} of {tourSteps.length}
            </Badge>
            <div className="flex-1 bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-700">{currentTourStep.content}</p>
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500"
            >
              Skip Tour
            </Button>
            
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < tourSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const useTour = () => {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('resume-builder-tour-completed');
    if (!tourCompleted) {
      // Show tour after a short delay
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = () => setShowTour(true);
  const closeTour = () => setShowTour(false);

  return { showTour, startTour, closeTour };
};