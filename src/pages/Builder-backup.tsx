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
import { BuilderSidebar } from "@/components/BuilderSidebar";
import { PageNavigation } from "@/components/PageNavigation";
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    <div className="min-h-screen bg-gray-50 flex">
      <ResumeEditLoader onLoadResume={handleLoadResume} />

      {/* Sidebar */}
      <BuilderSidebar
        isOpen={showSidebar}
        onToggle={() => setShowSidebar(!showSidebar)}
        onPreview={() => isMobile ? setShowPreviewModal(true) : setShowPreview(!showPreview)}
        onSave={handleSave}
        onDownload={handleDownload}
        onOpenTemplateSelector={() => setShowTemplateSelector(true)}
        isSaving={isSaving}
        isDownloading={isDownloading}
        canDownload={canDownload}
        totalDownloadsRemaining={totalDownloadsRemaining}
        getUserDisplayName={getUserDisplayName}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isMobile ? 'ml-0' : 'lg:ml-80'}`}>
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white border-b p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">
                Resume Builder
              </h1>
              {/* Download Progress */}
              {isDownloading && (
                <div className="flex items-center space-x-2">
                  <div className="w-32">
                    <Progress value={downloadProgress} className="h-2" />
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.round(downloadProgress)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex h-full">
          {/* Form Panel */}
          <div className={`${!isMobile && showPreview ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile Header Layout */}
          {isMobile ? (
            <div className="space-y-3">
              {/* Mobile Header Row 1 - Title and Download Status */}
              <div className="flex items-center justify-between">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {getUserDisplayName()}
                </h1>
                {user && (
                  <div className="flex items-center">
                    {canDownload ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200 bg-green-50 text-xs px-2 py-1"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        {totalDownloadsRemaining === 999999
                          ? "Unlimited"
                          : `${totalDownloadsRemaining} Left`}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-orange-600 border-orange-200 bg-orange-50 text-xs px-2 py-1"
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        No Downloads
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Header Row 2 - Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Mobile Preview Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreviewModal(true)}
                  className="flex-1 h-10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={isSaving || !user}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-10"
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
                  className="bg-gradient-primary hover:opacity-90 flex-1 h-10"
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
            </div>
          ) : (
            /* Desktop Header Layout */
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {getUserDisplayName()}
                </h1>
                {user && (
                  <div className="flex items-center gap-2">
                    {canDownload ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200 bg-green-50"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        {totalDownloadsRemaining === 999999
                          ? "Unlimited"
                          : `${totalDownloadsRemaining} Downloads Remaining`}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-orange-600 border-orange-200 bg-orange-50"
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        No Downloads Remaining
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Desktop Preview Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="hidden lg:flex"
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
                  Save Resume
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
                  Download PDF
                </Button>
              </div>
            </div>
          )}

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

                  {/* Form Tabs */}
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2">
                      <TabsTrigger value="personal">Personal</TabsTrigger>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="education">Education</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                    </TabsList>

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
                          marginBottom: zoom < 0.6 ? "-200px" : "20px",
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
