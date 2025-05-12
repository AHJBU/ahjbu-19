
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Moon, Sun, ChevronDown, LogIn, User, Menu, X } from 'lucide-react';
import { ModeToggle } from './ModeToggle';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

// Interface for navigation links
interface NavItem {
  id: string;
  title: string;
  titleAr: string;
  href: string;
  submenu?: NavItem[];
  enabled: boolean;
  order: number;
}

// Function to get navigation links from Supabase
const getNavigationLinks = async (): Promise<NavItem[]> => {
  try {
    const { data, error } = await supabase
      .from('navigation_links')
      .select('*')
      .eq('enabled', true)
      .order('order', { ascending: true });
    
    if (error) {
      console.error('Error fetching navigation links:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching navigation links:', error);
    return [];
  }
};

const Header = () => {
  const { language, toggleLanguage } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // Default navigation items if Supabase data is not available
  const defaultNavItems: NavItem[] = [
    { id: '1', title: 'Home', titleAr: 'الرئيسية', href: '/', enabled: true, order: 1 },
    { id: '2', title: 'Blog', titleAr: 'المدونة', href: '/blog', enabled: true, order: 2 },
    { id: '3', title: 'About', titleAr: 'حول', href: '/about', enabled: true, order: 3 },
    { id: '4', title: 'Projects', titleAr: 'المشاريع', href: '/projects', enabled: true, order: 4 },
    { id: '5', title: 'Courses', titleAr: 'الدورات', href: '/courses', enabled: true, order: 5 },
    { id: '6', title: 'Publications', titleAr: 'المنشورات', href: '/publications', enabled: true, order: 6 },
    { id: '7', title: 'Achievements', titleAr: 'الإنجازات', href: '/achievements', enabled: true, order: 7 },
    { id: '8', title: 'Contact', titleAr: 'اتصل بنا', href: '/contact', enabled: true, order: 8 },
  ];

  // Fetch navigation links from Supabase
  const { data: navItems = defaultNavItems } = useQuery({
    queryKey: ['navigation'],
    queryFn: getNavigationLinks,
    initialData: defaultNavItems
  });

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setPrevScrollPos(currentScrollPos);
      setVisible(visible);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileMenuButton = document.getElementById('mobile-menu-button');

      if (
        isMobileMenuOpen &&
        mobileMenu &&
        !mobileMenu.contains(target) &&
        mobileMenuButton &&
        !mobileMenuButton.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu when changing route
  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button 
            id="mobile-menu-button"
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-2" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
          
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            {language === 'en' ? 'Prof. Ali Habbal' : 'أ.د علي حبال'}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            item.submenu && item.submenu.length > 0 ? (
              <DropdownMenu key={item.id}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    {language === 'en' ? item.title : item.titleAr}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {item.submenu.map((subitem) => (
                    <DropdownMenuItem key={subitem.id} asChild>
                      <Link to={subitem.href} onClick={handleNavLinkClick}>
                        {language === 'en' ? subitem.title : subitem.titleAr}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                key={item.id}
                variant="ghost"
                asChild
              >
                <Link to={item.href} onClick={handleNavLinkClick}>
                  {language === 'en' ? item.title : item.titleAr}
                </Link>
              </Button>
            )
          ))}
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center space-x-1">
          {/* Language toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            <Globe className="h-5 w-5" />
          </Button>
          
          {/* Theme toggle */}
          <ModeToggle />
          
          {/* Login/Dashboard button */}
          {user ? (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/login">
                <LogIn className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu" 
          className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-lg"
        >
          <nav className="container mx-auto py-4 px-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                item.submenu && item.submenu.length > 0 ? (
                  <li key={item.id} className="py-2">
                    <div className="font-medium mb-2">
                      {language === 'en' ? item.title : item.titleAr}
                    </div>
                    <ul className="pl-4 space-y-1">
                      {item.submenu.map((subitem) => (
                        <li key={subitem.id}>
                          <Link
                            to={subitem.href}
                            className="block py-1 px-2 hover:bg-muted rounded"
                            onClick={handleNavLinkClick}
                          >
                            {language === 'en' ? subitem.title : subitem.titleAr}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.id}>
                    <Link
                      to={item.href}
                      className="block py-2 px-2 hover:bg-muted rounded"
                      onClick={handleNavLinkClick}
                    >
                      {language === 'en' ? item.title : item.titleAr}
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
