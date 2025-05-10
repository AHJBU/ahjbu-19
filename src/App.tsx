
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import Achievements from "./pages/Achievements";
import Publications from "./pages/Publications";
import Files from "./pages/Files";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardBlog from "./pages/dashboard/DashboardBlog";
import DashboardProjects from "./pages/dashboard/DashboardProjects";
import DashboardSettings from "./pages/dashboard/DashboardSettings";
import BlogEditor from "./pages/dashboard/BlogEditor";
import ProjectEditor from "./pages/dashboard/ProjectEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/files" element={<Files />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/blog" element={<DashboardBlog />} />
              <Route path="/dashboard/blog/editor/:id?" element={<BlogEditor />} />
              <Route path="/dashboard/projects" element={<DashboardProjects />} />
              <Route path="/dashboard/projects/editor/:id?" element={<ProjectEditor />} />
              <Route path="/dashboard/settings" element={<DashboardSettings />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
