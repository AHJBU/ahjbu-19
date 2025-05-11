
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/supabase-service";

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const { language, t } = useLanguage();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  
  // Get tag from URL query if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagParam = params.get('tag');
    if (tagParam) {
      setActiveTag(tagParam);
    }
  }, [location.search]);
  
  // Fetch posts
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });
  
  // Extract unique tags from posts
  const uniqueTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  ).sort();

  // Filter posts based on selected tag and search query
  const filteredPosts = posts
    .filter(post => !activeTag || post.tags.includes(activeTag))
    .filter(post => {
      const title = language === "en" ? post.title : post.titleAr;
      const excerpt = language === "en" ? post.excerpt : post.excerptAr;
      const searchTerm = searchQuery.toLowerCase();
      return (
        title.toLowerCase().includes(searchTerm) ||
        excerpt.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                {language === "en" ? "Blog" : "المدونة"}
              </h1>
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "Thoughts, ideas, and guides on web development, design, and more." 
                  : "أفكار وآراء وإرشادات حول تطوير الويب والتصميم والمزيد."
                }
              </p>
            </div>

            {/* Search bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={language === "en" ? "Search posts..." : "ابحث في المقالات..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              <Button
                variant={activeTag === null ? "default" : "outline"}
                onClick={() => {
                  setActiveTag(null);
                  setCurrentPage(1); // Reset to first page on tag change
                }}
                size="sm"
              >
                {language === "en" ? "All" : "الكل"}
              </Button>

              {uniqueTags.map((tag) => (
                <Button
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  onClick={() => {
                    setActiveTag(tag);
                    setCurrentPage(1); // Reset to first page on tag change
                  }}
                  size="sm"
                >
                  {tag}
                </Button>
              ))}
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}
            
            {/* Error state */}
            {isError && (
              <div className="text-center py-12">
                <p className="text-lg text-red-500 mb-4">
                  {language === "en" 
                    ? "Failed to load posts." 
                    : "فشل في تحميل المنشورات."
                  }
                </p>
                <Button onClick={() => window.location.reload()}>
                  {language === "en" ? "Retry" : "إعادة المحاولة"}
                </Button>
              </div>
            )}

            {/* Posts grid */}
            {!isLoading && !isError && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPosts.map((post) => (
                  <Link 
                    key={post.id}
                    to={`/blog/${post.id}`} 
                    className="group bg-card border rounded-xl overflow-hidden transition-all hover:shadow-lg animate-fade-in"
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={language === "en" ? post.title : post.titleAr}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{post.author}</span>
                        <span>{new Date(post.date).toLocaleDateString(language === "en" ? "en-US" : "ar-SA")}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {language === "en" ? post.title : post.titleAr}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {language === "en" ? post.excerpt : post.excerptAr}
                      </p>
                      
                      <div className="flex items-center text-sm font-medium text-primary">
                        <span>{t("readMore")}</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!isLoading && !isError && filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {language === "en" 
                    ? "No posts match your search." 
                    : "لا توجد مقالات تطابق بحثك."
                  }
                </p>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !isError && filteredPosts.length > 0 && totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          isActive={currentPage === i + 1}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
