import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "@/pages/Index";
import Builder from "@/pages/Builder";
import Templates from "@/pages/Templates";
import Pricing from "@/pages/Pricing";
import NotFound from "@/pages/NotFound";
import Navbar from "@/components/Navbar";
import SavedResumes from "@/pages/SavedResumes";
import DownloadedResumes from "@/pages/DownloadedResumes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/resumes" element={<SavedResumes />} />
            <Route path="/my-resumes" element={<SavedResumes />} />
            <Route path="/downloaded" element={<DownloadedResumes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
