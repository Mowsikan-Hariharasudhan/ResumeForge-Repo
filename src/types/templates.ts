import { ResumeData } from './resume';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  previewImage?: string;
}

export const TEMPLATES: Template[] = [
  // Universal Templates
  {
    id: "universal",
    name: "Universal",
    description: "A universal template for all industries.",
    category: "Universal",
  },
  // New Templates
  {
    id: "modern-blue",
    name: "Modern Blue",
    description: "A clean, modern template with blue accents and left-aligned header.",
    category: "Modern",
  },
  {
    id: "classic-elegance",
    name: "Classic Elegance",
    description: "A timeless template with centered serif fonts and subtle borders.",
    category: "Classic",
  },
  {
    id: "creative-gradient",
    name: "Creative Gradient",
    description: "A vibrant template with a colorful gradient background and right-aligned header.",
    category: "Creative",
  },
  {
    id: "professional-gray",
    name: "Professional Gray",
    description: "A professional template with gray tones and a two-column layout.",
    category: "Professional",
  },
  {
    id: "tech-circuit",
    name: "Tech Circuit",
    description: "A tech-inspired template with circuit-like lines, monospaced fonts, and a left sidebar.",
    category: "Tech",
  },
  {
    id: "elegant-gold",
    name: "Elegant Gold",
    description: "A luxurious template with gold highlights and refined typography.",
    category: "Elegant",
  },
  {
    id: "bold-red",
    name: "Bold Red",
    description: "A striking template with red accents and strong section dividers.",
    category: "Bold",
  },
  {
    id: "soft-pastel",
    name: "Soft Pastel",
    description: "A gentle template with pastel backgrounds and rounded corners.",
    category: "Soft",
  },
  {
    id: "geometric-blocks",
    name: "Geometric Blocks",
    description: "A geometric template with blocky section backgrounds and sans-serif fonts.",
    category: "Geometric",
  },
  {
    id: "mono-space",
    name: "Mono Space",
    description: "A developer-focused template with monospaced fonts and code-style layout.",
    category: "Developer",
  },
  {
    id: "sleek-black",
    name: "Sleek Black",
    description: "A modern, high-contrast template with black header and bold white text.",
    category: "Modern",
  },
  {
    id: "pastel-wave",
    name: "Pastel Wave",
    description: "A soft, approachable template with pastel color blocks and rounded sections.",
    category: "Soft",
  },
  {
    id: "sidebar-accent",
    name: "Sidebar Accent",
    description: "A two-column template with a colored sidebar for contact and skills.",
    category: "Sidebar",
  },
  {
    id: "royal-blue",
    name: "Royal Blue",
    description: "A professional template with blue highlights and a clean, classic layout.",
    category: "Professional",
  },
  {
    id: "circuit-tech",
    name: "Circuit Tech",
    description: "A tech-inspired template with circuit board lines and monospaced fonts.",
    category: "Tech",
  },
  {
    id: "elegant-purple",
    name: "Elegant Purple",
    description: "A sophisticated template with purple highlights and elegant section dividers.",
    category: "Elegant",
  },
  {
    id: "green-minimal",
    name: "Green Minimal",
    description: "A minimal template with green accents and lots of whitespace.",
    category: "Minimal",
  },
  {
    id: "orange-sidebar",
    name: "Orange Sidebar",
    description: "A bold template with an orange sidebar and clear section separation.",
    category: "Sidebar",
  },
  {
    id: "split-columns",
    name: "Split Columns",
    description: "A two-column layout with personal info on the left and main content on the right.",
    category: "Layout",
  },
  {
    id: "header-accent",
    name: "Header Accent",
    description: "A template with a bold, colored header and clean sections below.",
    category: "Accent",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "A timeline-style template for experience and education sections.",
    category: "Timeline",
  },
  {
    id: "sidebar-photo",
    name: "Sidebar Photo",
    description: "A sidebar template with space for a profile photo and contact info.",
    category: "Sidebar",
  },
  {
    id: "section-tabs",
    name: "Section Tabs",
    description: "Sections are separated visually as tabs for a modern look.",
    category: "Tabs",
  },
  {
    id: "diagonal-accent",
    name: "Diagonal Accent",
    description: "A template with a diagonal color accent across the header.",
    category: "Accent",
  },
  {
    id: "boxed-sections",
    name: "Boxed Sections",
    description: "Each section is in a separate box with subtle shadows.",
    category: "Boxed",
  },
  {
    id: "left-accent-bar",
    name: "Left Accent Bar",
    description: "A bold colored bar on the left for section titles.",
    category: "Accent",
  },
  {
    id: "compact-grid",
    name: "Compact Grid",
    description: "A compact, grid-based layout for dense information.",
    category: "Grid",
  },
];

export const getTemplateById = (id: string): Template | undefined => {
  return TEMPLATES.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  return TEMPLATES.filter((template) => template.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(TEMPLATES.map((template) => template.category))];
};

export interface TemplateRendererProps {
  templateId: string;
  resumeData: ResumeData;
  visibleFields?: Record<string, boolean>;
}
