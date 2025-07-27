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
import { useIsMobile } from "@/hooks/use-mobile";
import { useResumes } from "@/hooks/useResumes";
import { useAuth } from "@/hooks/useAuth";
import { usePurchases } from "@/hooks/usePurchases";
import { useFreeDownloads } from "@/hooks/useFreeDownloads";
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
  Gift,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResumeFieldVisibility } from '@/components/ResumePreview';

// Dummy data for initial preview
const dummyResumeData: ResumeData = {
  fullName: "John Smith",
  email: "john.smith@email.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  website: "https://johnsmith.dev",
  linkedin: "https://linkedin.com/in/johnsmith",
  github: "https://github.com/johnsmith",
  summary: "Experienced software engineer with 5+ years of expertise in full-stack development. Proven track record of delivering scalable web applications and leading cross-functional teams.",
  achievements: [
    "Led development of microservices architecture reducing system latency by 40%",
    "Mentored 5 junior developers, improving team productivity by 25%",
    "Implemented automated testing pipeline, reducing deployment time from 2 hours to 15 minutes"
  ],
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      duration: "2021 - Present",
      description: "Lead full-stack development of enterprise web applications using React, Node.js, and PostgreSQL. Collaborate with product managers and designers to deliver high-quality user experiences."
    },
    {
      position: "Software Engineer",
      company: "Digital Innovations LLC",
      duration: "2019 - 2021",
      description: "Developed and maintained responsive web applications using modern JavaScript frameworks. Participated in code reviews and contributed to architectural decisions."
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "University of Technology",
      year: "2019",
      grade: "3.8 GPA"
    }
  ],
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "PostgreSQL", "MongoDB", "AWS", "Docker", "Git"],
  languages: ["English (Native)", "Spanish (Conversational)"],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform with React frontend and Node.js backend, serving 10,000+ users",
      technologies: "React, Node.js, PostgreSQL, AWS",
      link: "https://github.com/johnsmith/ecommerce"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      year: "2022"
    }
  ]
};

const Builder = () => {
  // Basic state
  const [resumeData, setResumeData] = useState<ResumeData>(dummyResumeData);
  const [currentTemplate, setCurrentTemplate] = useState("modern-classic");
  const [resumeTitle, setResumeTitle] = useState("My Professional Resume");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [downloadedResumeId, setDownloadedResumeId] = useState<string | null>(null);
  const [isFromDownloaded, setIsFromDownloaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Mobile detection
  const isMobile = useIsMobile();

  // Preview controls state
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Visible fields state
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({
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
  });

  // Hooks
  const { resumes, saveResume, deleteResume } = useResumes();
  const { user } = useAuth();
  const { canDownload, totalDownloadsRemaining, consumeDownload } = usePurchases();
  const { hasFreeDownloads, freeDownloadsRemaining } = useFreeDownloads();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const previewRef = useRef<HTMLDivElement>(null);

  // Helper functions
  const getUserDisplayName = () => {
    if (resumeTitle && resumeTitle !== "My Professional Resume") {
      return resumeTitle;
    }
    return user?.email?.split('@')[0] || "Resume Builder";
  };

  const getTemplateDisplayName = (templateId: string) => {
    const template = getTemplateById(templateId);
    return template?.name || "Modern Classic";
  };

  // Event handlers
  const handleSave = useCallback(async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    try {
      const resumeDataToSave = {
        ...resumeData,
        title: resumeTitle,
        template: currentTemplate,
        visibleFields,
      };

      if (resumeId && !isFromDownloaded) {
        await saveResume(resumeDataToSave, resumeTitle, resumeId, currentTemplate);
        toast({
          title: "Resume updated!",
          description: "Your resume has been saved successfully.",
        });
      } else {
        const newResume = await saveResume(resumeDataToSave, resumeTitle, undefined, currentTemplate);
        setResumeId(newResume.id);
        setIsFromDownloaded(false);
        toast({
          title: "Resume saved!",
          description: "Your resume has been saved to your account.",
        });
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, resumeData, resumeTitle, currentTemplate, visibleFields, resumeId, isFromDownloaded, saveResume, toast]);

  const handleDownload = useCallback(async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!canDownload) {
      setShowPricingModal(true);
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const element = previewRef.current;
      if (!element) {
        throw new Error("Preview element not found");
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const opt = {
        margin: 0,
        filename: `${resumeTitle || "resume"}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          height: element.scrollHeight,
          width: element.scrollWidth
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };

      await html2pdf().set(opt).from(element).save();
      
      clearInterval(progressInterval);
      setDownloadProgress(100);

      // Track download
      const downloadSuccess = await consumeDownload();
      
      if (downloadSuccess) {
        toast({
          title: "Download successful!",
          description: hasFreeDownloads 
            ? "Your free download has been used successfully!" 
            : "Your resume has been downloaded as PDF.",
        });
      } else {
        toast({
          title: "Download completed",
          description: "Your resume has been downloaded as PDF.",
        });
      }

      setTimeout(() => {
        setDownloadProgress(0);
      }, 1000);

    } catch (error) {
      console.error("Error downloading resume:", error);
      toast({
        title: "Download failed",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  }, [user, canDownload, resumeTitle, consumeDownload, hasFreeDownloads, toast]);

  const handleTemplateChange = (templateId: string) => {
    setCurrentTemplate(templateId);
    setShowTemplateSelector(false);
  };

  const handleLoadResume = (data: any) => {
    if (data.resumeData) {
      setResumeData(data.resumeData);
      setResumeTitle(data.title || "Loaded Resume");
      setCurrentTemplate(data.template || "modern-classic");
      setVisibleFields(data.visibleFields || visibleFields);
      setResumeId(data.resumeId);
      setDownloadedResumeId(data.downloadedResumeId);
      setIsFromDownloaded(data.isFromDownloaded || false);
    }
  };

  // Experience handlers
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

  // Education handlers
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

  // Project handlers
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
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project,
      ),
    }));
  };

  const removeProject = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // Certification handlers
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

  // Zoom controls
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const resetZoom = () => setZoom(1.0);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ResumeEditLoader onLoadResume={handleLoadResume} />

      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">
              Resume Builder
            </h1>
            <div className="flex items-center gap-2">
              {/* Free Downloads Badge */}
              {user && hasFreeDownloads && (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <Gift className="w-3 h-3 mr-1" />
                  {freeDownloadsRemaining} Free
                </Badge>
              )}
              
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
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${isMobile ? 'pt-20' : ''}`}>
        {/* Content Area */}
        <div className="flex h-full">
          {/* Form Panel */}
          <div className={`${!isMobile && showPreview ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                {/* Resume Title and Download Status */}
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {resumeTitle}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newTitle = prompt('Enter resume title:', resumeTitle);
                        if (newTitle) setResumeTitle(newTitle);
                      }}
                    >
                      Edit Title
                    </Button>
                  </div>
                  
                  {/* Download Status for Desktop */}
                  {!isMobile && user && (
                    <div className="flex items-center gap-4 text-sm">
                      {hasFreeDownloads && (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <Gift className="w-3 h-3 mr-1" />
                            Free Downloads
                          </Badge>
                          <span className="text-gray-600">
                            {freeDownloadsRemaining} remaining
                          </span>
                        </div>
                      )}
                      
                      {totalDownloadsRemaining > freeDownloadsRemaining && (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium Downloads
                          </Badge>
                          <span className="text-gray-600">
                            {totalDownloadsRemaining - freeDownloadsRemaining} remaining
                          </span>
                        </div>
                      )}
                      
                      {!canDownload && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-orange-200 text-orange-700">
                            No downloads remaining
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-lg border">
                  <Tabs defaultValue="personal" className="w-full">
                    <div className="border-b p-4">
                      <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4">
                        <TabsTrigger value="personal">Personal</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="p-6">
                      {/* Personal Information */}
                      <TabsContent value="personal" className="space-y-4 mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                              id="fullName"
                              value={resumeData.fullName}
                              onChange={(e) => setResumeData(prev => ({ ...prev, fullName: e.target.value }))}
                              placeholder="John Doe"
                              className="h-12"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={resumeData.email}
                              onChange={(e) => setResumeData(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="john@example.com"
                              className="h-12"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={resumeData.phone}
                              onChange={(e) => setResumeData(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+1 (555) 123-4567"
                              className="h-12"
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={resumeData.location}
                              onChange={(e) => setResumeData(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="New York, NY"
                              className="h-12"
                            />
                          </div>
                          <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              value={resumeData.website}
                              onChange={(e) => setResumeData(prev => ({ ...prev, website: e.target.value }))}
                              placeholder="https://johndoe.com"
                              className="h-12"
                            />
                          </div>
                          <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              value={resumeData.linkedin}
                              onChange={(e) => setResumeData(prev => ({ ...prev, linkedin: e.target.value }))}
                              placeholder="https://linkedin.com/in/johndoe"
                              className="h-12"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="summary">Professional Summary</Label>
                          <Textarea
                            id="summary"
                            value={resumeData.summary}
                            onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                            placeholder="Brief overview of your professional background and key achievements..."
                            rows={4}
                            className="min-h-[100px]"
                          />
                        </div>

                        <AchievementsInput
                          achievements={resumeData.achievements}
                          onChange={(achievements) => setResumeData(prev => ({ ...prev, achievements }))}
                        />

                        <ResumeFieldVisibility visibleFields={visibleFields} onChange={setVisibleFields} />
                      </TabsContent>

                      {/* Experience */}
                      <TabsContent value="experience" className="space-y-4 mt-0">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Work Experience</h3>
                          <Button onClick={addExperience} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Experience
                          </Button>
                        </div>

                        {resumeData.experience.map((exp, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium">Experience {index + 1}</h4>
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
                                  onChange={(e) => updateExperience(index, "position", e.target.value)}
                                  placeholder="Software Engineer"
                                  className="h-12"
                                />
                              </div>
                              <div>
                                <Label>Company</Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                                  placeholder="Tech Corp"
                                  className="h-12"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Duration</Label>
                                <Input
                                  value={exp.duration}
                                  onChange={(e) => updateExperience(index, "duration", e.target.value)}
                                  placeholder="Jan 2020 - Present"
                                  className="h-12"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={exp.description}
                                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                                  placeholder="Describe your responsibilities and achievements..."
                                  rows={3}
                                  className="min-h-[100px]"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </TabsContent>

                      {/* Education */}
                      <TabsContent value="education" className="space-y-4 mt-0">
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
                              <h4 className="font-medium">Education {index + 1}</h4>
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
                                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                  placeholder="Bachelor of Science in Computer Science"
                                  className="h-12"
                                />
                              </div>
                              <div>
                                <Label>School</Label>
                                <Input
                                  value={edu.school}
                                  onChange={(e) => updateEducation(index, "school", e.target.value)}
                                  placeholder="University of Technology"
                                  className="h-12"
                                />
                              </div>
                              <div>
                                <Label>Year</Label>
                                <Input
                                  value={edu.year}
                                  onChange={(e) => updateEducation(index, "year", e.target.value)}
                                  placeholder="2020"
                                  className="h-12"
                                />
                              </div>
                              <div>
                                <Label>Grade (Optional)</Label>
                                <Input
                                  value={edu.grade}
                                  onChange={(e) => updateEducation(index, "grade", e.target.value)}
                                  placeholder="3.8 GPA"
                                  className="h-12"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </TabsContent>

                      {/* Skills */}
                      <TabsContent value="skills" className="space-y-4 mt-0">
                        <div>
                          <Label htmlFor="skills">Skills (comma-separated)</Label>
                          <Textarea
                            id="skills"
                            value={resumeData.skills.join(", ")}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              skills: e.target.value.split(",").map(s => s.trim()).filter(s => s)
                            }))}
                            placeholder="JavaScript, React, Node.js, Python, SQL"
                            rows={3}
                            className="min-h-[100px]"
                          />
                        </div>

                        <div>
                          <Label htmlFor="languages">Languages (comma-separated)</Label>
                          <Textarea
                            id="languages"
                            value={resumeData.languages.join(", ")}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              languages: e.target.value.split(",").map(s => s.trim()).filter(s => s)
                            }))}
                            placeholder="English (Native), Spanish (Fluent), French (Conversational)"
                            rows={2}
                            className="min-h-[80px]"
                          />
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex flex-col gap-4">
                    {/* Template Selection */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Template</Label>
                      <Button
                        onClick={() => setShowTemplateSelector(true)}
                        variant="outline"
                        className="w-full mt-1 justify-start h-12"
                      >
                        <Palette className="w-4 h-4 mr-2" />
                        {getTemplateDisplayName(currentTemplate)}
                        <span className="ml-auto text-xs text-gray-500">Change</span>
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Resume"}
                      </Button>

                      <Button 
                        onClick={handleDownload} 
                        disabled={isDownloading || !user}
                        className={`flex-1 h-12 ${
                          hasFreeDownloads 
                            ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700' 
                            : canDownload 
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                              : 'bg-gray-400'
                        }`}
                      >
                        {isDownloading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : hasFreeDownloads ? (
                          <Gift className="w-4 h-4 mr-2" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        {isDownloading 
                          ? "Downloading..." 
                          : hasFreeDownloads 
                            ? `Free Download (${freeDownloadsRemaining})` 
                            : canDownload 
                              ? "Download PDF" 
                              : "Get Premium"
                        }
                      </Button>
                    </div>

                    {/* Download Status Info */}
                    {user && (
                      <div className="text-xs text-gray-600 text-center">
                        {hasFreeDownloads ? (
                          <span className="text-green-600 font-medium">
                            🎉 You have {freeDownloadsRemaining} free download{freeDownloadsRemaining !== 1 ? 's' : ''} remaining!
                          </span>
                        ) : totalDownloadsRemaining > 0 ? (
                          <span>
                            {totalDownloadsRemaining} premium download{totalDownloadsRemaining !== 1 ? 's' : ''} remaining
                          </span>
                        ) : (
                          <span className="text-orange-600">
                            No downloads remaining. Upgrade to premium to continue.
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Preview Panel */}
          {!isMobile && showPreview && (
            <div className="w-1/2 border-l">
              <div className="h-full bg-white flex flex-col">
                {/* Preview Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
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

                {/* Preview Content */}
                <div className="flex-1 overflow-auto bg-gray-100 p-6">
                  <div className="flex justify-center">
                    <div
                      ref={previewRef}
                      className="resume-preview bg-white shadow-xl transition-transform duration-200 border border-gray-200 relative mobile-resume-preview"
                      style={{
                        width: "210mm",
                        minHeight: "297mm",
                        transform: `scale(${zoom})`,
                        transformOrigin: "top center",
                        marginBottom: "20px",
                      }}
                    >
                      <div className="resume-template-content">
                        <ResumePreview
                          data={resumeData}
                          template={currentTemplate}
                          visibleFields={visibleFields}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Action Button for Preview */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowPreviewModal(true)}
            size="lg"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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