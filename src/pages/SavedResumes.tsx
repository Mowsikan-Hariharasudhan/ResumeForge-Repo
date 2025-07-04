import { useResumes } from "@/hooks/useResumes";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar,
  FileText,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  Download,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TemplateRenderer } from "@/components/TemplateRenderer";
import { getTemplateById } from "@/types/templates";
import { TemplateCard } from "@/components/TemplateCard";

const SavedResumes = () => {
  const { user } = useAuth();
  const { resumes, deleteResume, loading } = useResumes();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "template">(
    "recent",
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sign in to Your Dashboard
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Access your saved resumes, track your applications, and manage your
            professional documents all in one place.
          </p>
          <Button
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Get Started Free
          </Button>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  const handleEdit = (resumeId: string) => {
    navigate(`/builder?resume=${resumeId}`);
  };

  const handlePreview = (resume: any) => {
    setSelectedResume(resume);
    setShowPreviewModal(true);
  };

  const handleDelete = async (resumeId: string) => {
    console.log("Delete button clicked for resume:", resumeId);

    if (
      window.confirm(
        "Are you sure you want to delete this resume? This action cannot be undone.",
      )
    ) {
      try {
        console.log("User confirmed deletion, calling deleteResume...");
        await deleteResume(resumeId);
        console.log("Delete operation completed");
      } catch (error) {
        console.error("Delete operation failed:", error);
      }
    } else {
      console.log("User cancelled deletion");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Filter and sort resumes
  const filteredResumes = resumes
    .filter(
      (resume) =>
        resume.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getTemplateById(resume.template_id)
          ?.name.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.title || "").localeCompare(b.title || "");
        case "template":
          const templateA = getTemplateById(a.template_id)?.name || "";
          const templateB = getTemplateById(b.template_id)?.name || "";
          return templateA.localeCompare(templateB);
        case "recent":
        default:
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Resumes
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your professional documents • {resumes.length} resume
                {resumes.length !== 1 ? "s" : ""} created
              </p>
            </div>
            <Button
              onClick={() => navigate("/builder")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Resume
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {resumes.length}
                    </p>
                    <p className="text-blue-700 font-medium">Total Resumes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        resumes.filter((r) => {
                          const hours =
                            (new Date().getTime() -
                              new Date(r.updated_at).getTime()) /
                            (1000 * 60 * 60);
                          return hours < 168; // Last week
                        }).length
                      }
                    </p>
                    <p className="text-green-700 font-medium">
                      Updated This Week
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(resumes.map((r) => r.template_id)).size}
                    </p>
                    <p className="text-purple-700 font-medium">
                      Templates Used
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Filter and Search Section */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search resumes by title or template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 border-2 border-gray-200 focus:border-blue-500"
              />
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 bg-white"
              >
                <option value="recent">Recently Updated</option>
                <option value="name">Name A-Z</option>
                <option value="template">Template Type</option>
              </select>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-md"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-md"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredResumes.length} of {resumes.length} resumes
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {resumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Create Your First Resume?
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Start building a professional resume that gets you noticed. Choose
              from our collection of expertly designed templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/builder")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Resume
              </Button>
              <Button
                onClick={() => navigate("/templates")}
                variant="outline"
                className="text-lg px-8 py-3 border-2"
              >
                <Eye className="w-5 h-5 mr-2" />
                Browse Templates
              </Button>
            </div>
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No resumes found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms
            </p>
            <Button onClick={() => setSearchTerm("")} variant="outline">
              Clear Search
            </Button>
          </div>
        ) : (
          <div
            className={`grid ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "grid-cols-1 gap-4"
            }`}
          >
            {filteredResumes.map((resume) => (
              <TemplateCard
                key={resume.id}
                template={getTemplateById(resume.template_id)}
                onUse={() => handleEdit(resume.id)}
                isSelected={false}
                resumeData={resume.resume_data}
                className={
                  viewMode === "list"
                    ? "md:flex-row border-2 border-transparent group-hover:border-blue-400 transition-all duration-300"
                    : "border-2 border-transparent group-hover:border-blue-400 transition-all duration-300"
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center">
                <FileText className="w-6 h-6 mr-3 text-blue-600" />
                <span>{selectedResume?.title || "Resume Preview"}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowPreviewModal(false);
                    if (selectedResume) {
                      handleEdit(selectedResume.id);
                    }
                  }}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Resume
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6 overflow-y-auto">
            {selectedResume && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <TemplateRenderer
                  templateId={selectedResume.template_id || "modern-classic"}
                  resumeData={selectedResume.resume_data}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedResumes;
