export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  previewImage?: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "modern-classic",
    name: "Modern Classic",
    description:
      "Clean and professional design with a modern touch. Perfect for business and corporate roles.",
    category: "Professional",
  },
  {
    id: "creative-bold",
    name: "Creative Bold",
    description:
      "Eye-catching design with creative elements. Ideal for designers and creative professionals.",
    category: "Creative",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description:
      "Simple and elegant layout focusing on content. Great for any industry.",
    category: "Minimal",
  },
  {
    id: "executive-elite",
    name: "Executive Elite",
    description:
      "Sophisticated design for senior executives and leadership positions.",
    category: "Executive",
  },
  {
    id: "tech-developer",
    name: "Tech Developer",
    description:
      "Code-inspired design perfect for software engineers and developers.",
    category: "Technical",
  },
  {
    id: "academic-scholar",
    name: "Academic Scholar",
    description: "Traditional academic format for researchers and academics.",
    category: "Academic",
  },
  {
    id: "healthcare-pro",
    name: "Healthcare Pro",
    description: "Professional medical template for healthcare professionals.",
    category: "Healthcare",
  },
  {
    id: "sales-achiever",
    name: "Sales Achiever",
    description:
      "Results-focused design highlighting achievements and metrics.",
    category: "Sales",
  },
  {
    id: "consultant-expert",
    name: "Consultant Expert",
    description: "Strategic layout perfect for consultants and advisors.",
    category: "Consulting",
  },
  {
    id: "startup-innovator",
    name: "Startup Innovator",
    description: "Dynamic design for startup professionals and entrepreneurs.",
    category: "Startup",
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
