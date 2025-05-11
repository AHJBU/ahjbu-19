
import { useState, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Image
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbs?: Array<{ label: string; href: string }>;
}

export function DashboardLayout({ children, title, breadcrumbs = [] }: DashboardLayoutProps) {
  const { language, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: language === "en" ? "Dashboard" : "لوحة التحكم",
      href: "/dashboard",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: language === "en" ? "Blog Posts" : "منشورات المدونة",
      href: "/dashboard/blog",
    },
    {
      icon: <FolderKanban className="h-5 w-5" />,
      label: language === "en" ? "Projects" : "المشاريع",
      href: "/dashboard/projects",
    },
    {
      icon: <Image className="h-5 w-5" />,
      label: language === "en" ? "Media" : "الوسائط",
      href: "/dashboard/media",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: language === "en" ? "Settings" : "الإعدادات",
      href: "/dashboard/settings",
    }
  ];

  const handleLogout = () => {
    // This would be implemented with actual auth later
    console.log("Logging out...");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background/50 backdrop-blur-sm border"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r shadow-lg transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">
              {language === "en" ? "Admin Panel" : "لوحة الإدارة"}
            </h2>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-md transition-colors",
                      location.pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {item.icon}
                    <span className="ms-3">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/20"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 me-3" />
              {language === "en" ? "Log Out" : "تسجيل الخروج"}
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start mt-2"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4 me-2" />
                {language === "en" ? "Back to Website" : "العودة للموقع"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b p-4">
          <div className="flex flex-col gap-2">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                {language === "en" ? "Home" : "الرئيسية"}
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/dashboard" className="hover:text-foreground">
                {language === "en" ? "Dashboard" : "لوحة التحكم"}
              </Link>
              
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center">
                  <ChevronRight className="h-4 w-4 mx-1" />
                  <Link to={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
            
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </header>
        
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
