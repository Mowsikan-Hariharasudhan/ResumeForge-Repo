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
  Plus,
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="text-center">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4 px-3 py-1 text-sm md:px-4 md:py-2 md:text-base">
              <Sparkles className="w-4 h-4 mr-2" />
              Professional Resume Templates
            </Badge>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Template
            </h1>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              Select from our collection of expertly designed, ATS-friendly
              templates
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input
              type="search"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
              <Button
                variant={selectedCategory === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("popular")}
              >
                Popular
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600 mr-1">Sort by:</label>
            <select
              id="sort"
              className="border rounded px-2 py-1 text-sm"
              value={viewMode}
              onChange={e => setViewMode(e.target.value as any)}
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
            </select>
          </div>
        </div>

        {/* Template Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredTemplates
            .filter(template =>
              selectedCategory === "popular"
                ? popularTemplates.includes(template.id)
                : true
            )
            .map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleUseTemplate}
                className={
                  viewMode === "list"
                    ? "md:flex-row border-2 border-transparent group-hover:border-blue-400 transition-all duration-300"
                    : "border-2 border-transparent group-hover:border-blue-400 transition-all duration-300"
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
