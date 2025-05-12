
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/components/ui/use-toast';

interface WordPressImporterProps {
  onImport: (data: {
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    featured_media?: string;
  }) => void;
}

export const WordPressImporter = ({ onImport }: WordPressImporterProps) => {
  const { language } = useLanguage();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleImport = async () => {
    if (!url) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Please enter a valid WordPress URL" : "الرجاء إدخال رابط ووردبريس صالح",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Extract domain and post ID/slug from URL
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);
      const postSlug = pathSegments[pathSegments.length - 1];
      const domain = urlObj.origin;
      
      console.log('Fetching from WordPress API:', `${domain}/wp-json/wp/v2/posts?slug=${postSlug}`);
      
      // Create a proxy URL to avoid CORS issues
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`${domain}/wp-json/wp/v2/posts?slug=${postSlug}`)}`;
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch WordPress post');
      }
      
      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('No content returned from proxy');
      }
      
      const posts = JSON.parse(data.contents);
      
      if (!posts || posts.length === 0) {
        throw new Error('No posts found with this URL');
      }
      
      const post = posts[0];
      
      // Get featured image if available
      let featuredMediaUrl = undefined;
      if (post.featured_media) {
        const mediaProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`${domain}/wp-json/wp/v2/media/${post.featured_media}`)}`;
        const mediaResponse = await fetch(mediaProxyUrl);
        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          const media = JSON.parse(mediaData.contents);
          featuredMediaUrl = media.source_url;
        }
      }
      
      // Get tags
      const tags: string[] = [];
      if (post.tags && post.tags.length > 0) {
        for (const tagId of post.tags) {
          const tagProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`${domain}/wp-json/wp/v2/tags/${tagId}`)}`;
          const tagResponse = await fetch(tagProxyUrl);
          if (tagResponse.ok) {
            const tagData = await tagResponse.json();
            const tag = JSON.parse(tagData.contents);
            tags.push(tag.name);
          }
        }
      }
      
      // Process the post content
      // Convert WordPress content to clean HTML
      const content = post.content.rendered
        .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
        .replace(/<script[\s\S]*?<\/script>/g, ''); // Remove scripts
      
      onImport({
        title: post.title.rendered,
        content,
        excerpt: post.excerpt.rendered,
        tags,
        featured_media: featuredMediaUrl
      });
      
      setOpen(false);
      toast({
        title: language === "en" ? "Success" : "تم بنجاح",
        description: language === "en" ? "WordPress post imported successfully" : "تم استيراد منشور ووردبريس بنجاح",
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: language === "en" ? "Import Failed" : "فشل الاستيراد",
        description: language === "en" 
          ? "Could not import WordPress post. Make sure the URL is correct and the post is public."
          : "تعذر استيراد منشور ووردبريس. تأكد من صحة الرابط وأن المنشور عام.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          {language === "en" ? "Import from WordPress" : "استيراد من ووردبريس"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === "en" ? "Import from WordPress" : "استيراد من ووردبريس"}
          </DialogTitle>
          <DialogDescription>
            {language === "en" 
              ? "Enter the URL of a WordPress post to import its content."
              : "أدخل رابط منشور ووردبريس لاستيراد محتواه."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="wordpress-url">
              {language === "en" ? "WordPress Post URL" : "رابط منشور ووردبريس"}
            </Label>
            <Input
              id="wordpress-url"
              placeholder="https://example.com/blog/post-name"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            {language === "en"
              ? "This will import the post title, content, excerpt, tags, and featured image if available."
              : "سيتم استيراد عنوان المنشور والمحتوى والملخص والوسوم والصورة البارزة إذا كانت متاحة."
            }
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {language === "en" ? "Cancel" : "إلغاء"}
          </Button>
          <Button onClick={handleImport} disabled={isLoading}>
            {isLoading ? (
              <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> {language === "en" ? "Importing..." : "جاري الاستيراد..."}</>
            ) : (
              language === "en" ? "Import" : "استيراد"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
