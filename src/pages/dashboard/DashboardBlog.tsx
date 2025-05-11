
import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getPosts, deletePost } from "@/services/supabase-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostType } from "@/data/posts";

const DashboardBlog = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  
  // Fetch posts
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });
  
  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: language === "en" ? "Post deleted" : "تم حذف المنشور",
        description: language === "en" 
          ? "The post has been deleted successfully" 
          : "تم حذف المنشور بنجاح",
      });
      setPostToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en"
          ? "Failed to delete the post. Please try again."
          : "فشل في حذف المنشور. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });
  
  const filteredPosts = posts.filter(post => {
    const title = language === "en" ? post.title : post.titleAr;
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const getStatusBadge = (date: string) => {
    const postDate = new Date(date);
    const now = new Date();
    
    if (postDate > now) {
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
          {language === "en" ? "Scheduled" : "مجدول"}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
          {language === "en" ? "Published" : "منشور"}
        </Badge>
      );
    }
  };

  const confirmDelete = (id: string) => {
    setPostToDelete(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <DashboardLayout 
      title={language === "en" ? "Manage Blog Posts" : "إدارة منشورات المدونة"}
      breadcrumbs={[
        { label: language === "en" ? "Blog" : "المدونة", href: "/dashboard/blog" }
      ]}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={language === "en" ? "Search posts..." : "البحث في المنشورات..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button asChild>
          <Link to="/dashboard/blog/editor">
            <Plus className="h-4 w-4 mr-2" />
            {language === "en" ? "New Post" : "منشور جديد"}
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-500">
            {language === "en" 
              ? "Failed to load posts. Please try again." 
              : "فشل في تحميل المقالات. الرجاء المحاولة مرة أخرى."
            }
          </p>
          <Button 
            variant="outline" 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['posts'] })} 
            className="mt-4"
          >
            {language === "en" ? "Retry" : "إعادة المحاولة"}
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === "en" ? "Title" : "العنوان"}</TableHead>
                <TableHead className="hidden md:table-cell">{language === "en" ? "Author" : "الكاتب"}</TableHead>
                <TableHead className="hidden md:table-cell">{language === "en" ? "Date" : "التاريخ"}</TableHead>
                <TableHead className="hidden md:table-cell">{language === "en" ? "Status" : "الحالة"}</TableHead>
                <TableHead className="w-[100px]">{language === "en" ? "Actions" : "إجراءات"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      {language === "en" ? post.title : post.titleAr}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(post.date).toLocaleDateString(
                        language === "en" ? "en-US" : "ar-SA",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getStatusBadge(post.date)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/blog/${post.id}`} className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              {language === "en" ? "View" : "عرض"}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/blog/editor/${post.id}`} className="flex items-center">
                              <Pencil className="mr-2 h-4 w-4" />
                              {language === "en" ? "Edit" : "تعديل"}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500"
                            onClick={() => confirmDelete(post.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {language === "en" ? "Delete" : "حذف"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {language === "en" ? "No posts found" : "لم يتم العثور على منشورات"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Are you sure you want to delete this post?" : "هل أنت متأكد أنك تريد حذف هذا المنشور؟"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en" 
                ? "This action cannot be undone. This will permanently delete the post."
                : "لا يمكن التراجع عن هذا الإجراء. سيؤدي ذلك إلى حذف المنشور نهائيًا."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={() => postToDelete && handleDelete(postToDelete)}
            >
              {language === "en" ? "Delete" : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default DashboardBlog;
