
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardProjects from './pages/dashboard/DashboardProjects';
import DashboardBlog from './pages/dashboard/DashboardBlog';
import ProjectEditor from './pages/dashboard/ProjectEditor';
import BlogEditor from './pages/dashboard/BlogEditor';
import DashboardSettings from './pages/dashboard/DashboardSettings';
import MediaManager from './pages/dashboard/MediaManager';
import FileManager from './pages/dashboard/FileManager';
import DashboardCourses from './pages/dashboard/DashboardCourses';
import CourseEditor from './pages/dashboard/CourseEditor';
import Courses from './pages/Courses';
import Files from './pages/Files';
import Achievements from './pages/Achievements';
import Publications from './pages/Publications';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                
                {/* New pages */}
                <Route path="/courses" element={<Courses />} />
                <Route path="/files" element={<Files />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/publications" element={<Publications />} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard/projects" element={<ProtectedRoute><DashboardProjects /></ProtectedRoute>} />
                <Route path="/dashboard/projects/editor" element={<ProtectedRoute><ProjectEditor /></ProtectedRoute>} />
                <Route path="/dashboard/projects/editor/:id" element={<ProtectedRoute><ProjectEditor /></ProtectedRoute>} />
                <Route path="/dashboard/blog" element={<ProtectedRoute><DashboardBlog /></ProtectedRoute>} />
                <Route path="/dashboard/blog/editor" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
                <Route path="/dashboard/blog/editor/:id" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
                <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />
                <Route path="/dashboard/media" element={<ProtectedRoute><MediaManager /></ProtectedRoute>} />
                <Route path="/dashboard/files" element={<ProtectedRoute><FileManager /></ProtectedRoute>} />
                <Route path="/dashboard/courses" element={<ProtectedRoute><DashboardCourses /></ProtectedRoute>} />
                <Route path="/dashboard/courses/editor" element={<ProtectedRoute><CourseEditor /></ProtectedRoute>} />
                <Route path="/dashboard/courses/editor/:id" element={<ProtectedRoute><CourseEditor /></ProtectedRoute>} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
