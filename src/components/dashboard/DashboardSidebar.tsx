
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  GraduationCap,
  BookOpen,
  Trophy,
  FolderIcon,
  ImageIcon,
  Settings,
  User,
  GlobeIcon,
  MapPin,
  Briefcase,
  Mail
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function DashboardSidebar() {
  const { language } = useLanguage();
  const location = useLocation();
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background fixed">
        <div className="p-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold"
          >
            <GlobeIcon className="h-6 w-6" />
            <span className="text-xl font-bold">
              {language === "en" ? "Admin" : "الإدارة"}
            </span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto p-3">
          <div className="grid gap-1">
            <Link to="/dashboard">
              <Button
                variant={location.pathname === "/dashboard" ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {language === "en" ? "Dashboard" : "لوحة التحكم"}
              </Button>
            </Link>

            {/* Profile Management */}
            <Collapsible
              open={isProfileOpen}
              onOpenChange={setIsProfileOpen}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between",
                    location.pathname.includes("/dashboard/profile") && "bg-accent"
                  )}
                >
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{language === "en" ? "Profile" : "الملف الشخصي"}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn("h-4 w-4 transition-transform", isProfileOpen && "rotate-180")}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 pt-1">
                <div className="grid gap-1">
                  <Link to="/dashboard/profile">
                    <Button
                      variant={location.pathname === "/dashboard/profile" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {language === "en" ? "My Profile" : "ملفي الشخصي"}
                    </Button>
                  </Link>
                  <Link to="/dashboard/profile-editor">
                    <Button
                      variant={location.pathname === "/dashboard/profile-editor" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      {language === "en" ? "Experience & Education" : "الخبرات والتعليم"}
                    </Button>
                  </Link>
                  <Link to="/dashboard/header-editor">
                    <Button
                      variant={location.pathname === "/dashboard/header-editor" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      <GlobeIcon className="mr-2 h-4 w-4" />
                      {language === "en" ? "Edit Header" : "تعديل الرأس"}
                    </Button>
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Link to="/dashboard/blog">
              <Button
                variant={location.pathname.includes("/dashboard/blog") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                {language === "en" ? "Blog Posts" : "المقالات"}
              </Button>
            </Link>

            <Link to="/dashboard/projects">
              <Button
                variant={location.pathname.includes("/dashboard/projects") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <FolderKanban className="mr-2 h-4 w-4" />
                {language === "en" ? "Projects" : "المشاريع"}
              </Button>
            </Link>

            <Link to="/dashboard/courses">
              <Button
                variant={location.pathname.includes("/dashboard/courses") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                {language === "en" ? "Courses" : "الدورات"}
              </Button>
            </Link>

            <Link to="/dashboard/publications">
              <Button
                variant={location.pathname.includes("/dashboard/publications") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {language === "en" ? "Publications" : "المنشورات"}
              </Button>
            </Link>

            <Link to="/dashboard/achievements">
              <Button
                variant={location.pathname.includes("/dashboard/achievements") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Trophy className="mr-2 h-4 w-4" />
                {language === "en" ? "Achievements" : "الإنجازات"}
              </Button>
            </Link>

            {/* Content Management */}
            <Collapsible
              open={isContentOpen}
              onOpenChange={setIsContentOpen}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between",
                    (location.pathname.includes("/dashboard/files") ||
                      location.pathname.includes("/dashboard/media")) && "bg-accent"
                  )}
                >
                  <div className="flex items-center">
                    <FolderIcon className="mr-2 h-4 w-4" />
                    <span>{language === "en" ? "Content" : "المحتوى"}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn("h-4 w-4 transition-transform", isContentOpen && "rotate-180")}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 pt-1">
                <div className="grid gap-1">
                  <Link to="/dashboard/files">
                    <Button
                      variant={location.pathname === "/dashboard/files" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      <FolderIcon className="mr-2 h-4 w-4" />
                      {language === "en" ? "Files" : "الملفات"}
                    </Button>
                  </Link>
                  <Link to="/dashboard/media">
                    <Button
                      variant={location.pathname === "/dashboard/media" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {language === "en" ? "Media" : "الوسائط"}
                    </Button>
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Link to="/dashboard/settings">
              <Button
                variant={location.pathname.includes("/dashboard/settings") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                {language === "en" ? "Settings" : "الإعدادات"}
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
