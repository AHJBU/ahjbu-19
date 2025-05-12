
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import {
  BarChart3,
  FileText,
  BookOpen,
  Briefcase,
  Award,
  Settings,
  FileImage,
  Home,
  Mail,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  FileCode2,
  Share,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarLink {
  href: string;
  icon: React.ReactNode;
  label: string;
  labelAr: string;
}

export function DashboardSidebar() {
  const { language } = useLanguage();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links: SidebarLink[] = [
    {
      href: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Dashboard",
      labelAr: "لوحة التحكم",
    },
    {
      href: "/dashboard/blog",
      icon: <FileText className="h-5 w-5" />,
      label: "Blog",
      labelAr: "المدونة",
    },
    {
      href: "/dashboard/courses",
      icon: <BookOpen className="h-5 w-5" />,
      label: "Courses",
      labelAr: "الدورات",
    },
    {
      href: "/dashboard/projects",
      icon: <Briefcase className="h-5 w-5" />,
      label: "Projects",
      labelAr: "المشاريع",
    },
    {
      href: "/dashboard/publications",
      icon: <FileCode2 className="h-5 w-5" />,
      label: "Publications",
      labelAr: "المنشورات",
    },
    {
      href: "/dashboard/achievements",
      icon: <Award className="h-5 w-5" />,
      label: "Achievements",
      labelAr: "الإنجازات",
    },
    {
      href: "/dashboard/files",
      icon: <FileImage className="h-5 w-5" />,
      label: "Files",
      labelAr: "الملفات",
    },
    {
      href: "/dashboard/social-integrations",
      icon: <Share className="h-5 w-5" />,
      label: "Social",
      labelAr: "التواصل",
    },
    {
      href: "/",
      icon: <Home className="h-5 w-5" />,
      label: "View Site",
      labelAr: "عرض الموقع",
    },
    {
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      labelAr: "الإعدادات",
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="fixed bottom-4 right-4 z-40 md:hidden">
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={toggleMobileMenu}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r bg-sidebar-background text-sidebar-foreground transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
            <span className={cn("font-semibold text-lg", collapsed ? "hidden" : "block")}>
              {language === "en" ? "Admin" : "المشرف"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex"
            onClick={toggleSidebar}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="space-y-1 p-2">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                location.pathname === link.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground",
                collapsed ? "justify-center" : ""
              )}
            >
              {link.icon}
              <span className={cn("text-sm font-medium", collapsed ? "hidden" : "block")}>
                {language === "en" ? link.label : link.labelAr}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
