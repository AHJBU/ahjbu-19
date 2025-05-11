
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import "react-quill/dist/quill.snow.css";
import { PostType } from "@/data/posts";

const BlogPreview = () => {
  const { language } = useLanguage();
  const [post, setPost] = useState<Partial<PostType> | null>(null);
  
  useEffect(() => {
    const previewData = sessionStorage.getItem('postPreview');
    if (previewData) {
      setPost(JSON.parse(previewData));
    }
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-2xl font-bold mb-4">
              {language === "en" ? "No preview data found" : "لم يتم العثور على بيانات المعاينة"}
            </h1>
            <p className="mb-6">
              {language === "en"
                ? "The preview data has expired or was not properly set."
                : "انتهت صلاحية بيانات المعاينة أو لم يتم تعيينها بشكل صحيح."
              }
            </p>
            <Button onClick={() => window.close()}>
              {language === "en" ? "Close Preview" : "إغلاق المعاينة"}
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
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-md mb-8 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                {language === "en" 
                  ? "This is a preview. The post has not been published yet." 
                  : "هذه معاينة. لم يتم نشر المقال بعد."
                }
              </p>
              <Button size="sm" variant="outline" className="ml-auto" onClick={() => window.close()}>
                {language === "en" ? "Close Preview" : "إغلاق المعاينة"}
              </Button>
            </div>

            {/* Back button */}
            <Button asChild variant="outline" className="mb-8" size="sm">
              <div className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {language === "en" ? "Back to Editor" : "العودة إلى المحرر"}
              </div>
            </Button>

            {/* Header */}
            <header className="max-w-3xl mx-auto mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {language === "en" ? post.title : post.titleAr}
              </h1>

              <div className="flex items-center justify-between text-muted-foreground">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="font-medium">{post.author}</span>
                </div>
                <time dateTime={post.date}>
                  {post.date && new Date(post.date).toLocaleDateString(
                    language === "en" ? "en-US" : "ar-SA",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </time>
              </div>
            </header>

            {/* Featured Image */}
            {post.image && (
              <div className="max-w-4xl mx-auto mb-12">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt={language === "en" ? post.title : post.titleAr}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="max-w-3xl mx-auto prose dark:prose-invert prose-lg">
              <div className="ql-snow">
                <div className="ql-editor">
                  {language === "en" ? (
                    <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
                  ) : (
                    <div dir="rtl" dangerouslySetInnerHTML={{ __html: post.contentAr || "" }} />
                  )}
                </div>
              </div>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 py-4 border-t">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-muted rounded-full text-sm text-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPreview;
