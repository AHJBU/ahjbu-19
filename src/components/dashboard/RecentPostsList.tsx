
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Eye, Pencil } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { PostType } from '@/data/posts';

export function RecentPostsList() {
  const { language } = useLanguage();
  const [recentPosts, setRecentPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        setRecentPosts(data as PostType[]);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "en" ? "Recent Posts" : "آخر المنشورات"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array(3).fill(null).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-muted-foreground/20 rounded-full animate-pulse" />
                <div>
                  <div className="h-4 w-32 bg-muted-foreground/20 animate-pulse rounded mb-2" />
                  <div className="h-3 w-24 bg-muted-foreground/10 animate-pulse rounded" />
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-16 bg-muted-foreground/10 animate-pulse rounded" />
                <div className="h-8 w-16 bg-muted-foreground/10 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === "en" ? "Recent Posts" : "آخر المنشورات"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="font-medium">{language === "en" ? post.title : post.titleAr}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.date).toLocaleDateString(
                        language === "en" ? "en-US" : "ar-SA",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/blog/${post.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      {language === "en" ? "View" : "عرض"}
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/dashboard/blog/editor/${post.id}`}>
                      {language === "en" ? "Edit" : "تعديل"}
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                {language === "en" ? "No recent posts found" : "لم يتم العثور على منشورات حديثة"}
              </p>
              <Button asChild className="mt-2">
                <Link to="/dashboard/blog/editor">
                  {language === "en" ? "Create your first post" : "إنشاء أول منشور"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
