
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/services/supabase-service";
import "react-quill/dist/quill.snow.css";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">
              {language === "en" ? "Post not found" : "لم يتم العثور على المنشور"}
            </h1>
            <p className="mb-8">
              {language === "en" 
                ? "The post you're looking for doesn't exist or has been removed." 
                : "المنشور الذي تبحث عنه غير موجود أو تم إزالته."
              }
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === "en" ? "Back to Blog" : "العودة إلى المدونة"}
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <article className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            {/* Back button */}
            <Button asChild variant="outline" className="mb-8" size="sm">
              <Link to="/blog" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {language === "en" ? "Back to Blog" : "العودة إلى المدونة"}
              </Link>
            </Button>

            {/* Header */}
            <header className="max-w-3xl mx-auto mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {language === "en" ? post?.title : post?.titleAr}
              </h1>

              <div className="flex items-center justify-between text-muted-foreground">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="font-medium">{post?.author}</span>
                </div>
                <time dateTime={post?.date}>
                  {post?.date && new Date(post.date).toLocaleDateString(
                    language === "en" ? "en-US" : "ar-SA",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </time>
              </div>
            </header>

            {/* Featured Image */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={post?.image}
                  alt={language === "en" ? post?.title : post?.titleAr}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto prose dark:prose-invert prose-lg">
              <div className="ql-snow">
                <div className="ql-editor">
                  {language === "en" ? (
                    <div dangerouslySetInnerHTML={{ __html: post?.content || "" }} />
                  ) : (
                    <div dir="rtl" dangerouslySetInnerHTML={{ __html: post?.contentAr || "" }} />
                  )}
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8 py-4 border-t">
                {post?.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
