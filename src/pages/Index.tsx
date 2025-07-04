import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Download,
  Eye,
  Zap,
  Star,
  Check,
  Play,
  Users,
  Award,
  TrendingUp,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Clock,
  Shield,
  Rocket,
  Globe,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PricingSection } from "@/components/PricingSection";
import { TemplateCard } from "@/components/TemplateCard";
import { TEMPLATES } from "@/types/templates";

const Index = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Live Preview",
      description:
        "Watch your resume come to life as you type with instant visual feedback and real-time formatting",
      color: "blue",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "ATS-Optimized Templates",
      description:
        "All templates are designed to pass Applicant Tracking Systems and get you noticed by recruiters",
      color: "green",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "High-Quality PDF Export",
      description:
        "Download professional PDFs optimized for both digital applications and printing",
      color: "purple",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Creation",
      description:
        "Build a professional resume in minutes, not hours. Our smart system guides you through each step",
      color: "orange",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Security",
      description:
        "Your personal information is encrypted and secure. We never share your data with third parties",
      color: "red",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multiple Formats",
      description:
        "Choose from various international resume formats and industry-specific layouts",
      color: "indigo",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content:
        "Landed my dream job at Google! The ATS optimization really works and the templates are stunning.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      company: "Google",
    },
    {
      name: "Marcus Johnson",
      role: "Marketing Director at Meta",
      content:
        "The live preview feature saved me hours. Got 3 interview calls within a week of updating my resume!",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      company: "Meta",
    },
    {
      name: "Elena Rodriguez",
      role: "Design Director at Adobe",
      content:
        "The creative templates perfectly showcase my work. Finally, a resume builder that understands design!",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      company: "Adobe",
    },
  ];

  const stats = [
    {
      number: "50,000+",
      label: "Resumes Created",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "10",
      label: "Professional Templates",
      icon: <Star className="w-6 h-6" />,
    },
    {
      number: "98%",
      label: "Success Rate",
      icon: <Award className="w-6 h-6" />,
    },
    {
      number: "24/7",
      label: "Support Available",
      icon: <Heart className="w-6 h-6" />,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Resume Builder
                </Badge>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Build Your
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}
                    Dream{" "}
                  </span>
                  Resume in Minutes
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Create a professional, ATS-optimized resume that gets you
                  noticed. Join 50,000+ job seekers who landed their dream jobs
                  with our platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/builder">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-4"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Building Free
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 hover:bg-gray-50 text-lg px-8 py-4"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    View Templates
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="ml-2 text-gray-600 font-medium">
                    4.9/5 (2,000+ reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Content - Enhanced Demo */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="ml-4 text-sm text-gray-600 font-medium">
                      Resumify Builder
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <div className="h-8 bg-blue-100 rounded-full w-20"></div>
                      <div className="h-8 bg-purple-100 rounded-full w-24"></div>
                      <div className="h-8 bg-green-100 rounded-full w-16"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-xl shadow-lg animate-bounce">
                <Check className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-xl shadow-lg animate-pulse">
                <Download className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4">
              ✨ Powerful Features
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Stand Out
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help you create the perfect resume
              and land your dream job
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Templates Preview Section */}
      <section
        id="templates"
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              🎨 Professional Templates
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Design
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select from our collection of expertly designed, ATS-friendly
              templates crafted by professional designers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {TEMPLATES.slice(0, 6).map((template) => {
              const isPopular =
                template.id === "modern-classic" ||
                template.id === "tech-developer";

              return (
                <div key={template.id} className="relative">
                  {isPopular && (
                    <div className="flex justify-center mb-2">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 shadow-lg">
                        ⭐ Most Popular
                      </Badge>
                    </div>
                  )}

                  <TemplateCard
                    template={template}
                    onUse={(templateId) =>
                      (window.location.href = `/builder?template=${templateId}`)
                    }
                    showUseButton={true}
                    className="w-full transform hover:scale-105 transition-all duration-300"
                  />
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/templates">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
              >
                View All {TEMPLATES.length} Templates
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
              💬 Success Stories
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of successful job seekers who landed their dream
              jobs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-8">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-blue-600 font-medium">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-white mr-2" />
            <span className="text-white text-sm font-medium">
              Join 50,000+ professionals
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Start building your professional resume today and take the first
            step toward your dream job
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/builder">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 shadow-xl"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Building Now - Free
              </Button>
            </Link>
            <Link to="/templates">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4"
              >
                <Eye className="w-5 h-5 mr-2" />
                Browse Templates
              </Button>
            </Link>
          </div>

          <p className="text-blue-200 text-sm mt-6">
            No credit card required • Free forever • Premium features available
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;

// If you display template cards on the Index page, ensure TemplateCard is used with the latest props and visual style, e.g.:
// <TemplateCard template={template} onUse={...} className="border-2 border-transparent group-hover:border-blue-400 transition-all duration-300" />
