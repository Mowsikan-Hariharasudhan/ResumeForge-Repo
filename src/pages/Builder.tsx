import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeActions } from "@/components/ResumeActions";
import { AchievementsInput } from "@/components/AchievementsInput";
import { ResumeEditLoader } from "@/components/ResumeEditLoader";
import { PricingModal } from "@/components/PricingModal";
import { AuthModal } from "@/components/AuthModal";
import { TemplateSelector } from "@/components/TemplateSelector";
import { ResumePreview } from "@/components/ResumePreview";
import { ResumePreviewModal } from "@/components/ResumePreviewModal";
// import { BuilderSidebar } from "@/components/BuilderSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResumes } from "@/hooks/useResumes";
import { useAuth } from "@/hooks/useAuth";
import { usePurchases } from "@/hooks/usePurchases";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";
import { TEMPLATES, getTemplateById } from "@/types/templates";
import {
  Plus,
  Trash2,
  Download,
  Save,
  Eye,
  EyeOff,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Crown,
  Star,
  Palette,
  Menu,
  X,
  Home,
  FileText,
  User,
  Zap,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResumeFieldVisibility } from '@/components/ResumePreview';

// Dummy data for initial preview
const dummyResumeData: ResumeData = {
  fullName: "John Doe",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  website: "https://johndoe.com",
  linkedin: "https://linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  summary:
    "Experienced Software Engineer with 5+ years of expertise in full-stack development. Passionate about creating scalable web applications and leading cross-functional teams to deliver high-quality software solutions.",
  achievements: [
    "Led development of microservices architecture that improved system performance by 40%",
    "Mentored 5 junior developers and established coding best practices",
    "Reduced application load time by 60% through optimization techniques",
  ],
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      duration: "Jan 2021 - Present",
      description:
        "Lead full-stack development of enterprise web applications using React, Node.js, and AWS. Collaborate with product managers and designers to deliver user-centric solutions. Implement CI/CD pipelines and maintain 99.9% uptime.",
    },
    {
      position: "Software Engineer",
      company: "Digital Innovations LLC",
      duration: "Jun 2019 - Dec 2020",
      description:
        "Developed and maintained RESTful APIs and responsive web interfaces. Worked with agile methodologies and participated in code reviews. Contributed to reducing bug reports by 35% through comprehensive testing.",
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "University of Technology",
      year: "2019",
      grade: "3.8 GPA",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "Git",
    "Agile/Scrum",
  ],
  languages: ["English (Native)", "Spanish (Conversational)"],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2022",
    },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description:
        "Built a full-stack e-commerce platform with React, Node.js, and Stripe integration. Implemented user authentication, product catalog, and order management system.",
      technologies: "React, Node.js, Express, MongoDB, Stripe API",
      link: "https://github.com/johndoe/ecommerce-platform",
    },
    {
      name: "Task Management App",
      description:
        "Developed a collaborative task management application with real-time updates using Socket.io. Features include team collaboration, file attachments, and progress tracking.",
      technologies: "React, Socket.io, Node.js, PostgreSQL",
      link: "https://github.com/johndoe/task-manager",
    },
  ],
};

const Builder = () => {
  const { user } = useAuth();
  const { saveResume, saveDownloadedResume } = useResumes();
  const { canDownload, purchases, consumeDownload, refreshPurchases } =
    usePurchases();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const previewRef = useRef<HTMLDivElement>(null);

  // State management - Initialize with dummy data
  const [resumeData, setResumeData] = useState<ResumeData>(dummyResumeData);
  const [currentTemplate, setCurrentTemplate] = useState("modern-classic");
  const [resumeTitle, setResumeTitle] = useState("My Professional Resume");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [downloadedResumeId, setDownloadedResumeId] = useState<string | null>(
    null,
  );
  const [isFromDownloaded, setIsFromDownloaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("personal");

  // Mobile detection
  const isMobile = useIsMobile();

  // Preview controls state - Start with 100% zoom (1.0)
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Add state for visible fields (all true by default)
  const defaultVisibleFields = {
    fullName: true,
    email: true,
    phone: true,
    location: true,
    website: true,
    linkedin: true,
    github: true,
    summary: true,
    achievements: true,
    experience: true,
    education: true,
    skills: true,
    languages: true,
    certifications: true,
    projects: true,
  };
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>(defaultVisibleFields);

  // Tab navigation and progress tracking
  const tabs = ["personal", "experience", "education", "skills", "additional"];
  const getTabProgress = (tabId: string) => {
    switch (tabId) {
      case "personal":
        return (resumeData.fullName && resumeData.email) ? 100 : 50;
      case "experience":
        return resumeData.experience.length > 0 ? 100 : 0;
      case "education":
        return resumeData.education.length > 0 ? 100 : 0;
      case "skills":
        return resumeData.skills.length > 0 ? 100 : 0;
      case "additional":
        return (resumeData.projects.length > 0 || resumeData.certifications.length > 0) ? 100 : 0;
      default:
        return 0;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "ArrowRight":
            e.preventDefault();
            const currentIndex = tabs.indexOf(currentTab);
            const nextIndex = (currentIndex + 1) % tabs.length;
            setCurrentTab(tabs[nextIndex]);
            break;
          case "ArrowLeft":
            e.preventDefault();
            const currentLeftIndex = tabs.indexOf(currentTab);
            const prevIndex = (currentLeftIndex - 1 + tabs.length) % tabs.length;
            setCurrentTab(tabs[prevIndex]);
            break;
          case "s":
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [currentTab, tabs]);

  // Calculate total downloads remaining
  const totalDownloadsRemaining = purchases.reduce((total, purchase) => {
    const isNotExpired =
      !purchase.expires_at || new Date(purchase.expires_at) > new Date();
    return isNotExpired ? total + purchase.downloads_remaining : total;
  }, 0);

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "Resume Builder";

    // Try to get full name from user metadata
    const fullName = user.user_metadata?.full_name;
    if (fullName) return fullName;

    // Fallback to email username
    if (user.email) {
      return user.email.split("@")[0];
    }

    return "User";
  };

  // Listen for payment success events
  useEffect(() => {
    const handlePaymentSuccess = () => {
      refreshPurchases();
      setShowPricingModal(false);
    };

    window.addEventListener("paymentSuccess", handlePaymentSuccess);
    return () =>
      window.removeEventListener("paymentSuccess", handlePaymentSuccess);
  }, [refreshPurchases]);

  // Load template from URL params
  useEffect(() => {
    const templateParam = searchParams.get("template");
    if (templateParam && getTemplateById(templateParam)) {
      setCurrentTemplate(templateParam);
    }
  }, [searchParams]);

  const handleLoadResume = useCallback((data: any) => {
    // Ensure we're updating state properly with spread to trigger re-renders
    setResumeData((prev) => ({ ...prev, ...data.resumeData }));
    setResumeTitle(data.title || "My Professional Resume");
    if (data.templateId && getTemplateById(data.templateId)) {
      setCurrentTemplate(data.templateId);
    }
    setResumeId(data.resumeId || null);
    setDownloadedResumeId(data.downloadedResumeId || null);
    setIsFromDownloaded(data.isFromDownloaded || false);
  }, []);

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveResume(
        resumeData,
        resumeTitle,
        resumeId,
        currentTemplate,
      );
      if (result && !resumeId) {
        setResumeId(result.id);
      }

      // Show success toast for manual saves
      toast({
        title: "Success",
        description: resumeId
          ? "Resume updated successfully"
          : "Resume saved successfully",
      });
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Preview control functions - Updated for 100% default zoom
  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.3));
  const resetZoom = () => setZoom(1.0); // Reset to 100%

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setZoom(1.2); // Slightly larger for fullscreen
    } else {
      setZoom(1.0); // Back to 100%
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setCurrentTemplate(templateId);
    toast({
      title: "Template changed",
      description: `Switched to ${getTemplateById(templateId)?.name || "template"}`,
    });
  };

  const getTemplateDisplayName = (templateId: string) => {
    const template = getTemplateById(templateId);
    return template?.name || "Modern Classic";
  };

  const simulateProgress = (callback: () => void) => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      setTimeout(callback, 500);
    }, 2000);
  };

  const handleDownload = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!canDownload) {
      setShowPricingModal(true);
      return;
    }

    setIsDownloading(true);

    try {
      // Simulate progress for better UX
      simulateProgress(async () => {
        if (!previewRef.current) {
          throw new Error("Preview not available");
        }

        // Hide watermarks temporarily
        const watermarkElements = previewRef.current.querySelectorAll(
          ".absolute.inset-0.pointer-events-none, .absolute.top-1\\/4, .absolute.bottom-1\\/4",
        );
        watermarkElements.forEach((element) => {
          (element as HTMLElement).style.display = "none";
        });

        // Configure PDF options for high quality
        const options = {
          margin: 0,
          filename: `${resumeTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            allowTaint: false,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compress: true,
          },
        };

        // Generate and download PDF
        await html2pdf().from(previewRef.current).set(options).save();

        // Restore watermarks
        watermarkElements.forEach((element) => {
          (element as HTMLElement).style.display = "";
        });

        // Consume download credit
        const consumed = await consumeDownload();
        if (!consumed) {
          throw new Error("Failed to process download credit");
        }

        // Save to downloaded resumes
        await saveDownloadedResume(
          resumeData,
          resumeTitle,
          currentTemplate,
          downloadedResumeId,
        );

        toast({
          title: "Success!",
          description: "Your resume has been downloaded successfully.",
        });

        setIsDownloading(false);
        setDownloadProgress(0);
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description:
          "There was an error downloading your resume. Please try again.",
        variant: "destructive",
      });
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { position: "", company: "", duration: "", description: "" },
      ],
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp,
      ),
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", school: "", year: "", grade: "" },
      ],
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu,
      ),
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", description: "", technologies: "", link: "" },
      ],
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj,
      ),
    }));
  };

  const removeProject = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: "", issuer: "", year: "" },
      ],
    }));
  };

  const updateCertification = (index: number, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert,
      ),
    }));
  };

  const removeCertification = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <ResumeEditLoader onLoadResume={handleLoadResume} />

      {/* Inline Sidebar Component */}
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'w-80' : 'w-64'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/LOGO-RESUMIFY.png" 
                alt="Resumify" 
                className="h-8 w-8"
              />
              <h2 className="text-xl font-bold text-gray-900">Resumify</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {canDownload ? (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200 bg-green-50 text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {totalDownloadsRemaining === 999999
                        ? "Unlimited"
                        : `${totalDownloadsRemaining} Downloads Left`}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200 bg-orange-50 text-xs"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      No Downloads
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 h-auto"
            asChild
          >
            <a href="/">
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </a>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 h-auto"
            asChild
          >
            <a href="/my-resumes">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Saved Resumes</span>
            </a>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 h-auto"
            asChild
          >
            <a href="/downloaded">
              <Download className="w-5 h-5" />
              <span className="font-medium">Downloads</span>
            </a>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 h-auto"
            onClick={() => setShowTemplateSelector(true)}
          >
            <Palette className="w-5 h-5" />
            <span className="font-medium">Templates</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 h-auto"
            onClick={() => setShowPreviewModal(true)}
          >
            <Eye className="w-5 h-5" />
            <span className="font-medium">Preview</span>
          </Button>
          
          <Button
            variant="ghost"
            className={`
              w-full justify-start gap-3 px-3 py-2 h-auto
              ${isSaving || !user ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={handleSave}
            disabled={isSaving || !user}
          >
            <Save className="w-5 h-5" />
            <span className="font-medium">Save Resume</span>
            {isSaving && (
              <div className="ml-auto">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </Button>
          
          <Button
            variant="ghost"
            className={`
              w-full justify-start gap-3 px-3 py-2 h-auto
              ${!canDownload ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={handleDownload}
            disabled={!canDownload}
          >
            <Download className="w-5 h-5" />
            <span className="font-medium">Download PDF</span>
          </Button>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2025 Resumify. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Simple Sidebar */}
      {sidebarOpen && (
        <>
          {/* Mobile Overlay */}
          {isMobile && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`
            fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 transition-transform duration-300 ease-in-out
            ${isMobile ? 'w-80' : 'w-64'}
          `}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src="/LOGO-RESUMIFY.png" 
                    alt="Resumify" 
                    className="h-8 w-8"
                  />
                  <h2 className="text-xl font-bold text-gray-900">Resumify</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {canDownload ? (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200 bg-green-50 text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          {totalDownloadsRemaining === 999999
                            ? "Unlimited"
                            : `${totalDownloadsRemaining} Downloads Left`}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-200 bg-orange-50 text-xs"
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          No Downloads
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 h-auto"
                asChild
              >
                <a href="/">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </a>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 h-auto"
                asChild
              >
                <a href="/my-resumes">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Saved Resumes</span>
                </a>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 h-auto"
                asChild
              >
                <a href="/downloaded">
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Downloads</span>
                </a>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 h-auto"
                onClick={() => setShowTemplateSelector(true)}
              >
                <Palette className="w-5 h-5" />
                <span className="font-medium">Templates</span>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 h-auto"
                onClick={() => setShowPreviewModal(true)}
              >
                <Eye className="w-5 h-5" />
                <span className="font-medium">Preview</span>
              </Button>
              
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 px-3 py-2 h-auto ${
                  isSaving || !user ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSave}
                disabled={isSaving || !user}
              >
                <Save className="w-5 h-5" />
                <span className="font-medium">Save Resume</span>
                {isSaving && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </Button>
              
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 px-3 py-2 h-auto ${
                  !canDownload ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleDownload}
                disabled={!canDownload}
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">Download PDF</span>
              </Button>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  © 2025 Resumify. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="bg-white border-b sticky top-0 z-30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Menu Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <h1 className="text-xl font-bold text-gray-900">
                Resume Builder
              </h1>
              {user && (
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-1 ${
                    canDownload 
                      ? 'text-green-600 border-green-200 bg-green-50'
                      : 'text-orange-600 border-orange-200 bg-orange-50'
                  }`}
                >
                  {canDownload ? (
                    <>
                      <Download className="w-3 h-3 mr-1" />
                      {totalDownloadsRemaining === 999999
                        ? "Unlimited"
                        : `${totalDownloadsRemaining} Downloads Left`}
                    </>
                  ) : (
                    <>
                      <Crown className="w-3 h-3 mr-1" />
                      No Downloads
                    </>
                  )}
                </Badge>
              )}
            </div>

            {/* Desktop Actions */}
            {!isMobile && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? (
                    <EyeOff className="w-4 h-4 mr-2" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !user}
                  variant="outline"
                  size="sm"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="bg-gradient-primary hover:opacity-90"
                  size="sm"
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download
                </Button>
              </div>
            )}
          </div>

          {/* Download Progress */}
          {isDownloading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Generating PDF...</span>
                <span>{Math.round(downloadProgress)}%</span>
              </div>
              <Progress value={downloadProgress} className="h-2" />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-4">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[calc(100vh-120px)]"
          >
            {/* Editor Panel */}
            <ResizablePanel defaultSize={(!isMobile && showPreview) ? 50 : 100} minSize={30}>
              <Card className="h-full">
                <CardContent className="p-6 h-full overflow-y-auto">
                  <div className="space-y-6">
                    {/* Resume Actions */}
                    <ResumeActions
                      currentTemplate={currentTemplate}
                      onTemplateChange={handleTemplateChange}
                      onSave={handleSave}
                      onDownload={handleDownload}
                      onOpenTemplateSelector={() => setShowTemplateSelector(true)}
                      isSaving={isSaving}
                      title={resumeTitle}
                      onTitleChange={setResumeTitle}
                    />

                    {/* Form Tabs - Enhanced UX */}
                    <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                      <div className="sticky top-0 bg-white z-10 pb-2 border-b">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-700">Resume Builder</h3>
                          
                        </div>
                        
                        {/* Mobile Scrollable Tabs */}
                        <div className="block sm:hidden">
                          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
                            <button
                              onClick={() => setCurrentTab("personal")}
                              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                                currentTab === "personal"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-50 text-gray-600 hover:bg-blue-50"
                              }`}
                            >
                              <User className="w-4 h-4" />
                              <span className="text-xs">Info</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                                  style={{ width: `${getTabProgress("personal")}%` }}
                                />
                              </div>
                            </button>
                            
                            <button
                              onClick={() => setCurrentTab("experience")}
                              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                                currentTab === "experience"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-50 text-gray-600 hover:bg-blue-50"
                              }`}
                            >
                              <FileText className="w-4 h-4" />
                              <span className="text-xs">Work</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                                  style={{ width: `${getTabProgress("experience")}%` }}
                                />
                              </div>
                            </button>
                            
                            <button
                              onClick={() => setCurrentTab("education")}
                              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                                currentTab === "education"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-50 text-gray-600 hover:bg-blue-50"
                              }`}
                            >
                              <Star className="w-4 h-4" />
                              <span className="text-xs">Edu</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                                  style={{ width: `${getTabProgress("education")}%` }}
                                />
                              </div>
                            </button>
                            
                            <button
                              onClick={() => setCurrentTab("skills")}
                              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                                currentTab === "skills"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-50 text-gray-600 hover:bg-blue-50"
                              }`}
                            >
                              <Zap className="w-4 h-4" />
                              <span className="text-xs">Skills</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                                  style={{ width: `${getTabProgress("skills")}%` }}
                                />
                              </div>
                            </button>
                            
                            <button
                              onClick={() => setCurrentTab("additional")}
                              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                                currentTab === "additional"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-50 text-gray-600 hover:bg-blue-50"
                              }`}
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-xs">More</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                                  style={{ width: `${getTabProgress("additional")}%` }}
                                />
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Desktop Grid Tabs */}
                        <TabsList className="hidden sm:grid w-full grid-cols-3 md:grid-cols-5 gap-1 h-auto p-1 bg-gray-50 rounded-lg">
                          <TabsTrigger 
                            value="personal" 
                            className="text-sm py-3 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 relative"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>Personal</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                                  style={{ width: `${getTabProgress("personal")}%` }}
                                />
                              </div>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="experience" 
                            className="text-sm py-3 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 relative"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>Experience</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                                  style={{ width: `${getTabProgress("experience")}%` }}
                                />
                              </div>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="education" 
                            className="text-sm py-3 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 relative"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>Education</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                                  style={{ width: `${getTabProgress("education")}%` }}
                                />
                              </div>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="skills" 
                            className="text-sm py-3 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 relative"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <Zap className="w-4 h-4" />
                              <span>Skills</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                                  style={{ width: `${getTabProgress("skills")}%` }}
                                />
                              </div>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="additional" 
                            className="text-sm py-3 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 relative"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <Plus className="w-4 h-4" />
                              <span>More</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                                  style={{ width: `${getTabProgress("additional")}%` }}
                                />
                              </div>
                            </div>
                          </TabsTrigger>
                        </TabsList>
                      </div>

                    {/* Personal Information */}
                    <TabsContent value="personal" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            value={resumeData.fullName}
                            onChange={(e) => {
                              const value = e.target.value;
                              setResumeData((prev) => ({
                                ...prev,
                                fullName: value,
                              }));
                            }}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={resumeData.email}
                            onChange={(e) => {
                              const value = e.target.value;
                              setResumeData((prev) => ({
                                ...prev,
                                email: value,
                              }));
                            }}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={resumeData.phone}
                            onChange={(e) => {
                              const value = e.target.value;
                              setResumeData((prev) => ({
                                ...prev,
                                phone: value,
                              }));
                            }}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={resumeData.location}
                            onChange={(e) => {
                              const value = e.target.value;
                              setResumeData((prev) => ({
                                ...prev,
                                location: value,
                              }));
                            }}
                            placeholder="New York, NY"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={resumeData.website}
                            onChange={(e) => {
                              const value = e.target.value;
                              setResumeData((prev) => ({
                                ...prev,
                                website: value,
                              }));
                            }}
                            placeholder="https://johndoe.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={resumeData.linkedin}
                            onChange={(e) => {
                              const value = e.target.value;
                              setResumeData((prev) => ({
                                ...prev,
                                linkedin: value,
                              }));
                            }}
                            placeholder="https://linkedin.com/in/johndoe"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea
                          id="summary"
                          value={resumeData.summary}
                          onChange={(e) => {
                            const value = e.target.value;
                            setResumeData((prev) => ({
                              ...prev,
                              summary: value,
                            }));
                          }}
                          placeholder="Brief overview of your professional background and key achievements..."
                          rows={4}
                        />
                      </div>

                      <AchievementsInput
                        achievements={resumeData.achievements}
                        onChange={(achievements) =>
                          setResumeData((prev) => ({ ...prev, achievements }))
                        }
                      />

                      {/* Field Visibility Controls */}
                      <ResumeFieldVisibility visibleFields={visibleFields} onChange={setVisibleFields} />
                    </TabsContent>

                    {/* Experience */}
                    <TabsContent value="experience" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          Work Experience
                        </h3>
                        <Button onClick={addExperience} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>

                      {resumeData.experience.map((exp, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">
                              Experience {index + 1}
                            </h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeExperience(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Position</Label>
                              <Input
                                value={exp.position}
                                onChange={(e) =>
                                  updateExperience(
                                    index,
                                    "position",
                                    e.target.value,
                                  )
                                }
                                placeholder="Software Engineer"
                              />
                            </div>
                            <div>
                              <Label>Company</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) =>
                                  updateExperience(
                                    index,
                                    "company",
                                    e.target.value,
                                  )
                                }
                                placeholder="Tech Corp"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label>Duration</Label>
                              <Input
                                value={exp.duration}
                                onChange={(e) =>
                                  updateExperience(
                                    index,
                                    "duration",
                                    e.target.value,
                                  )
                                }
                                placeholder="Jan 2020 - Present"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label>Description</Label>
                              <Textarea
                                value={exp.description}
                                onChange={(e) =>
                                  updateExperience(
                                    index,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Describe your responsibilities and achievements..."
                                rows={3}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </TabsContent>

                    {/* Education */}
                    <TabsContent value="education" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Education</h3>
                        <Button onClick={addEducation} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Education
                        </Button>
                      </div>

                      {resumeData.education.map((edu, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">
                              Education {index + 1}
                            </h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeEducation(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Degree</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) =>
                                  updateEducation(
                                    index,
                                    "degree",
                                    e.target.value,
                                  )
                                }
                                placeholder="Bachelor of Science in Computer Science"
                              />
                            </div>
                            <div>
                              <Label>School</Label>
                              <Input
                                value={edu.school}
                                onChange={(e) =>
                                  updateEducation(
                                    index,
                                    "school",
                                    e.target.value,
                                  )
                                }
                                placeholder="University of Technology"
                              />
                            </div>
                            <div>
                              <Label>Year</Label>
                              <Input
                                value={edu.year}
                                onChange={(e) =>
                                  updateEducation(index, "year", e.target.value)
                                }
                                placeholder="2020"
                              />
                            </div>
                            <div>
                              <Label>Grade (Optional)</Label>
                              <Input
                                value={edu.grade}
                                onChange={(e) =>
                                  updateEducation(
                                    index,
                                    "grade",
                                    e.target.value,
                                  )
                                }
                                placeholder="3.8 GPA"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </TabsContent>

                    {/* Skills */}
                    <TabsContent value="skills" className="space-y-4">
                      <div>
                        <Label htmlFor="skills">Skills (comma-separated)</Label>
                        <Textarea
                          id="skills"
                          value={resumeData.skills.join(", ")}
                          onChange={(e) =>
                            setResumeData((prev) => ({
                              ...prev,
                              skills: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter((s) => s),
                            }))
                          }
                          placeholder="JavaScript, React, Node.js, Python, SQL"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="languages">
                          Languages (comma-separated)
                        </Label>
                        <Textarea
                          id="languages"
                          value={resumeData.languages.join(", ")}
                          onChange={(e) =>
                            setResumeData((prev) => ({
                              ...prev,
                              languages: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter((s) => s),
                            }))
                          }
                          placeholder="English (Native), Spanish (Fluent), French (Conversational)"
                          rows={2}
                        />
                      </div>
                    </TabsContent>

                    {/* Additional */}
                    <TabsContent value="additional" className="space-y-6">
                      {/* Projects */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Projects</h3>
                          <Button onClick={addProject} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Project
                          </Button>
                        </div>

                        {resumeData.projects.map((project, index) => (
                          <Card key={index} className="p-4 mb-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium">
                                Project {index + 1}
                              </h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeProject(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Project Name</Label>
                                <Input
                                  value={project.name}
                                  onChange={(e) =>
                                    updateProject(index, "name", e.target.value)
                                  }
                                  placeholder="E-commerce Platform"
                                />
                              </div>
                              <div>
                                <Label>Technologies</Label>
                                <Input
                                  value={project.technologies}
                                  onChange={(e) =>
                                    updateProject(
                                      index,
                                      "technologies",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="React, Node.js, MongoDB"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={project.description}
                                  onChange={(e) =>
                                    updateProject(
                                      index,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Describe the project and your role..."
                                  rows={3}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Link (Optional)</Label>
                                <Input
                                  value={project.link}
                                  onChange={(e) =>
                                    updateProject(index, "link", e.target.value)
                                  }
                                  placeholder="https://github.com/username/project"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>

                      {/* Certifications */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">
                            Certifications
                          </h3>
                          <Button onClick={addCertification} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Certification
                          </Button>
                        </div>

                        {resumeData.certifications.map((cert, index) => (
                          <Card key={index} className="p-4 mb-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium">
                                Certification {index + 1}
                              </h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeCertification(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Certification Name</Label>
                                <Input
                                  value={cert.name}
                                  onChange={(e) =>
                                    updateCertification(
                                      index,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="AWS Certified Solutions Architect"
                                />
                              </div>
                              <div>
                                <Label>Issuer</Label>
                                <Input
                                  value={cert.issuer}
                                  onChange={(e) =>
                                    updateCertification(
                                      index,
                                      "issuer",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Amazon Web Services"
                                />
                              </div>
                              <div>
                                <Label>Year</Label>
                                <Input
                                  value={cert.year}
                                  onChange={(e) =>
                                    updateCertification(
                                      index,
                                      "year",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="2023"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>

          {/* Enhanced Preview Panel with Watermark - Desktop Only */}
          {!isMobile && showPreview && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={30}>
                <Card
                  className={`h-full ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}
                >
                  <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Live Preview
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {getTemplateDisplayName(currentTemplate)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 border rounded-md p-1 bg-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={zoomOut}
                          disabled={zoom <= 0.3}
                          className="h-7 w-7 p-0"
                        >
                          <ZoomOut className="w-3 h-3" />
                        </Button>

                        <span className="text-xs font-mono min-w-[3rem] text-center">
                          {Math.round(zoom * 100)}%
                        </span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={zoomIn}
                          disabled={zoom >= 2}
                          className="h-7 w-7 p-0"
                        >
                          <ZoomIn className="w-3 h-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetZoom}
                          className="h-7 w-7 p-0"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </div>

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
                    </div>
                  </div>

                  <CardContent className="p-6 h-full overflow-auto bg-gray-100">
                    <div className="flex justify-center">
                      <div
                        ref={previewRef}
                        className="resume-preview bg-white shadow-xl transition-transform duration-200 border border-gray-200 relative"
                        style={{
                          width: "210mm",
                          minHeight: "297mm",
                          transform: `scale(${zoom})`,
                          transformOrigin: "top center",
                          marginBottom: zoom < 0.6 ? "-200px" : "0",
                        }}
                      >
                        {/* Watermark Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                          <div
                            className="text-gray-200 text-6xl font-bold transform rotate-45 opacity-30 select-none"
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

                        {/* Multiple watermarks for better coverage */}
                        <div className="absolute top-1/4 left-1/4 pointer-events-none z-40">
                          <div className="text-gray-100 text-3xl font-bold transform rotate-45 opacity-25 select-none">
                            Resumify
                          </div>
                        </div>
                        <div className="absolute bottom-1/4 right-1/4 pointer-events-none z-40">
                          <div className="text-gray-100 text-3xl font-bold transform rotate-45 opacity-25 select-none">
                            Resumify
                          </div>
                        </div>

                        <div className="resume-template-content">
                          <ResumePreview
                            data={resumeData}
                            template={currentTemplate}
                            visibleFields={visibleFields}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Preview Footer */}
                  <div className="p-3 border-t bg-gray-50 text-center">
                    <p className="text-xs text-gray-600">
                      Use Ctrl/Cmd + Plus/Minus to zoom, or use the controls
                      above
                    </p>
                  </div>
                </Card>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
      </div>

      {/* Mobile Floating Action Button for Preview */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowPreviewModal(true)}
            size="lg"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 mobile-fab"
          >
            <Eye className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Modals */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleTemplateChange}
        currentTemplateId={currentTemplate}
        resumeData={resumeData}
      />

      {/* Mobile Preview Modal */}
      <ResumePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        data={resumeData}
        template={currentTemplate}
        visibleFields={visibleFields}
        templateDisplayName={getTemplateDisplayName(currentTemplate)}
        onDownload={handleDownload}
        onSave={handleSave}
        isDownloading={isDownloading}
        isSaving={isSaving}
        canDownload={canDownload}
        userDisplayName={user?.email || "Resume Preview"}
      />
    </div>
  );
};

export default Builder;
