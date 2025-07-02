import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Star,
  Zap,
  ArrowRight,
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TemplateCard } from "@/components/TemplateCard";
import { TEMPLATES, getAllCategories } from "@/types/templates";

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  const categories = getAllCategories();

  // Filter templates based on category and search term
  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesCategory = selectedCategory
      ? template.category === selectedCategory
      : true;
    const matchesSearch = searchTerm
      ? template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (templateId: string) => {
    navigate(`/builder?template=${templateId}`);
  };

  const popularTemplates = [
    "modern-classic",
    "tech-developer",
    "creative-bold",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Professional Resume Templates
            </Badge>

            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Choose Your Perfect
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Template
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Browse our collection of {TEMPLATES.length} professionally
              designed, ATS-optimized templates. Each template is crafted to
              help you stand out and get noticed by recruiters.
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{TEMPLATES.length} Professional Templates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>100% ATS Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Free to Use</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="ml-2 text-gray-600 font-medium">
                Rated 4.9/5 by 50,000+ users
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Search and Filter Section */}
      <section className="py-8 bg-white border-b sticky top-16 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search templates by name, category, or style..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="rounded-full"
                size="sm"
              >
                All Templates ({TEMPLATES.length})
              </Button>
              {categories.map((category) => {
                const count = TEMPLATES.filter(
                  (t) => t.category === category,
                ).length;
                return (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full"
                    size="sm"
                  >
                    {category} ({count})
                  </Button>
                );
              })}
            </div>

            {/* View Mode Toggle */}
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

          {/* Search Results Info */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-600">
              {searchTerm || selectedCategory ? (
                <>
                  Showing {filteredTemplates.length} of {TEMPLATES.length}{" "}
                  templates
                </>
              ) : (
                <>Showing all {TEMPLATES.length} templates</>
              )}
              {searchTerm && <span> for "{searchTerm}"</span>}
              {selectedCategory && <span> in {selectedCategory}</span>}
            </p>

            {filteredTemplates.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No templates found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse all categories
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Browse All Templates
              </Button>
            </div>
          ) : (
            <>
              {/* Popular Templates Section */}
              {!searchTerm && !selectedCategory && (
                <div className="mb-12">
                  <div className="flex items-center mb-6">
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 mr-3">
                      ⭐ Most Popular
                    </Badge>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Trending Templates
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TEMPLATES.filter((t) =>
                      popularTemplates.includes(t.id),
                    ).map((template) => (
                      <div key={template.id} className="relative">
                        <Badge className="absolute -top-2 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                          Popular
                        </Badge>
                        <TemplateCard
                          template={template}
                          onUse={handleUseTemplate}
                          showUseButton={true}
                          className="transform hover:scale-105 transition-all duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Templates Grid */}
              <div className="space-y-12">
                {selectedCategory ? (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {selectedCategory}
                      </span>
                      <span className="ml-3 text-gray-900">Templates</span>
                      <Badge variant="secondary" className="ml-3">
                        {filteredTemplates.length}
                      </Badge>
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Professional templates designed specifically for{" "}
                      {selectedCategory.toLowerCase()} roles
                    </p>
                  </div>
                ) : (
                  !searchTerm && (
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        All Templates
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Browse our complete collection of professional resume
                        templates
                      </p>
                    </div>
                  )
                )}

                <div
                  className={`grid ${
                    viewMode === "grid"
                      ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                      : "grid-cols-1 lg:grid-cols-2 gap-6"
                  }`}
                >
                  {filteredTemplates.map((template) => {
                    const isPopular = popularTemplates.includes(template.id);
                    return (
                      <div key={template.id} className="relative">
                        {isPopular && !selectedCategory && !searchTerm && (
                          <Badge className="absolute -top-2 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                            Popular
                          </Badge>
                        )}
                        <TemplateCard
                          template={template}
                          onUse={handleUseTemplate}
                          showUseButton={true}
                          className={`${viewMode === "list" ? "flex-row" : ""} transform hover:scale-105 transition-all duration-300`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Templates?
            </h2>
            <p className="text-gray-600">
              Every template is designed with your success in mind
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ATS Optimized</h3>
              <p className="text-gray-600">
                All templates pass through Applicant Tracking Systems
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Professional Design
              </h3>
              <p className="text-gray-600">
                Created by professional designers with years of experience
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Simply choose a template and start editing with our intuitive
                builder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-white mr-2" />
            <span className="text-white text-sm font-medium">
              Ready to get started?
            </span>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4">
            Found Your Perfect Template?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start building your professional resume today and take the first
            step toward your dream job
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/builder">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 shadow-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Building Free
              </Button>
            </Link>
            <Link to="/">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Templates;
