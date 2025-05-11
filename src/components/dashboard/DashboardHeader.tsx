
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { SignOut } from "@/components/auth/SignOut";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { User } from "lucide-react";

export function DashboardHeader() {
  const { language } = useLanguage();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background flex h-16 items-center px-4 md:px-6">
      <div className="flex flex-1 items-center justify-end space-x-4">
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <LanguageSwitch />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">User profile</span>
          </Button>
          <div className="hidden md:flex">
            <span className="text-sm font-medium mr-2">
              {user?.email}
            </span>
            <SignOut />
          </div>
        </div>
      </div>
    </header>
  );
}
