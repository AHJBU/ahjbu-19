
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import AboutMe from './pages/AboutMe';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogPreview from './pages/BlogPreview';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import NotFound from './pages/NotFound';
import Achievements from './pages/Achievements';
import Files from './pages/Files';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Publications from './pages/Publications';
import PublicationPreview from './pages/PublicationPreview';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardBlog from './pages/dashboard/DashboardBlog';
import BlogEditor from './pages/dashboard/BlogEditor';
import DashboardProjects from './pages/dashboard/DashboardProjects';
import ProjectEditor from './pages/dashboard/ProjectEditor';
import DashboardFiles from './pages/dashboard/DashboardFiles';
import FileEditor from './pages/dashboard/FileEditor';
import DashboardProfile from './pages/dashboard/DashboardProfile';
import DashboardSettings from './pages/dashboard/DashboardSettings';
import DashboardAchievements from './pages/dashboard/DashboardAchievements';
import AchievementEditor from './pages/dashboard/AchievementEditor';
import DashboardPublications from './pages/dashboard/DashboardPublications';
import PublicationEditor from './pages/dashboard/PublicationEditor';
import DashboardCourses from './pages/dashboard/DashboardCourses';
import CourseEditor from './pages/dashboard/CourseEditor';
import DashboardCourseOrders from './pages/dashboard/DashboardCourseOrders';
import FileManager from './pages/dashboard/FileManager';
import MediaManager from './pages/dashboard/MediaManager';
import EnhancedBlogEditor from './components/editor/EnhancedBlogEditor';
import HeaderEditor from './pages/dashboard/HeaderEditor';
import { useEffect } from 'react';
import { setupDatabase } from './utils/database-setup';
import './App.css';

function App() {
  // Setup database tables if needed
  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/about-me" element={<AboutMe />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/blog/preview" element={<BlogPreview />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/files" element={<Files />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/publications" element={<Publications />} />
      <Route path="/publication-preview" element={<PublicationPreview />} />
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/blog" element={<ProtectedRoute><DashboardBlog /></ProtectedRoute>} />
      <Route path="/dashboard/blog/editor" element={<ProtectedRoute><EnhancedBlogEditor /></ProtectedRoute>} />
      <Route path="/dashboard/blog/editor/:id" element={<ProtectedRoute><EnhancedBlogEditor /></ProtectedRoute>} />
      <Route path="/dashboard/projects" element={<ProtectedRoute><DashboardProjects /></ProtectedRoute>} />
      <Route path="/dashboard/projects/editor" element={<ProtectedRoute><ProjectEditor /></ProtectedRoute>} />
      <Route path="/dashboard/projects/editor/:id" element={<ProtectedRoute><ProjectEditor /></ProtectedRoute>} />
      <Route path="/dashboard/files" element={<ProtectedRoute><DashboardFiles /></ProtectedRoute>} />
      <Route path="/dashboard/files/editor" element={<ProtectedRoute><FileEditor /></ProtectedRoute>} />
      <Route path="/dashboard/files/editor/:id" element={<ProtectedRoute><FileEditor /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardProfile /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />
      <Route path="/dashboard/header-editor" element={<ProtectedRoute><HeaderEditor /></ProtectedRoute>} />
      <Route path="/dashboard/achievements" element={<ProtectedRoute><DashboardAchievements /></ProtectedRoute>} />
      <Route path="/dashboard/achievements/editor" element={<ProtectedRoute><AchievementEditor /></ProtectedRoute>} />
      <Route path="/dashboard/achievements/editor/:id" element={<ProtectedRoute><AchievementEditor /></ProtectedRoute>} />
      <Route path="/dashboard/publications" element={<ProtectedRoute><DashboardPublications /></ProtectedRoute>} />
      <Route path="/dashboard/publications/editor" element={<ProtectedRoute><PublicationEditor /></ProtectedRoute>} />
      <Route path="/dashboard/publications/editor/:id" element={<ProtectedRoute><PublicationEditor /></ProtectedRoute>} />
      <Route path="/dashboard/courses" element={<ProtectedRoute><DashboardCourses /></ProtectedRoute>} />
      <Route path="/dashboard/courses/editor" element={<ProtectedRoute><CourseEditor /></ProtectedRoute>} />
      <Route path="/dashboard/courses/editor/:id" element={<ProtectedRoute><CourseEditor /></ProtectedRoute>} />
      <Route path="/dashboard/course-orders" element={<ProtectedRoute><DashboardCourseOrders /></ProtectedRoute>} />
      <Route path="/dashboard/files/manager" element={<ProtectedRoute><FileManager /></ProtectedRoute>} />
      <Route path="/dashboard/media" element={<ProtectedRoute><MediaManager /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
