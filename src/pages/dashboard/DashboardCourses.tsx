
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourses, deleteCourse, archiveCourse } from "@/services/course-service";
import { toast } from "@/components/ui/use-toast";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MoreVertical, PlusCircle, Edit, Trash, Archive, Eye, Users, BarChart, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardCourses = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  // Fetch courses data
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses
  });

  // Archive course mutation
  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: language === "en" ? "Course Archived" : "تم أرشفة الدورة",
        description: language === "en"
          ? "The course has been archived and is no longer visible to users."
          : "تم أرشفة الدورة ولم تعد مرئية للمستخدمين.",
      });
    },
  });

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: language === "en" ? "Course Deleted" : "تم حذف الدورة",
        description: language === "en"
          ? "The course has been deleted successfully."
          : "تم حذف الدورة بنجاح.",
      });
      setCourseToDelete(null);
    },
  });

  // Get unique categories and levels
  const categories = Array.from(new Set(courses.map(course => course.category)));
  const levels = Array.from(new Set(courses.map(course => course.level)));

  // Filter courses by search term, category, and level
  const filteredCourses = courses.filter(course => {
    const title = language === "en" ? course.title : course.titleAr;
    const description = language === "en" ? course.description : course.descriptionAr;
    
    const matchesSearch = 
      !searchTerm || 
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || course.category === categoryFilter;
    const matchesLevel = !levelFilter || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <DashboardLayout 
      title={language === "en" ? "Courses Management" : "إدارة الدورات"}
      breadcrumbs={[
        { label: language === "en" ? "Courses" : "الدورات", href: "/dashboard/courses" }
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={language === "en" ? "Search courses..." : "بحث في الدورات..."}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={categoryFilter || ""}
                    onChange={(e) => setCategoryFilter(e.target.value || null)}
                    className="p-2 border rounded-md"
                  >
                    <option value="">
                      {language === "en" ? "All categories" : "جميع الفئات"}
                    </option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {levels.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={levelFilter || ""}
                    onChange={(e) => setLevelFilter(e.target.value || null)}
                    className="p-2 border rounded-md"
                  >
                    <option value="">
                      {language === "en" ? "All levels" : "جميع المستويات"}
                    </option>
                    {levels.map(level => (
                      <option key={level} value={level}>
                        {language === "en" ? level : 
                          level === "Beginner" ? "مبتدئ" : 
                          level === "Intermediate" ? "متوسط" : "متقدم"
                        }
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <Button onClick={() => navigate("/dashboard/course-orders")}>
                <Users className="h-4 w-4 mr-2" />
                {language === "en" ? "Manage Orders" : "إدارة الطلبات"}
              </Button>
              
              <Button onClick={() => navigate("/dashboard/courses/editor")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                {language === "en" ? "Add Course" : "إضافة دورة"}
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {language === "en" ? "Course" : "الدورة"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Category" : "الفئة"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Price" : "السعر"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Status" : "الحالة"}
                    </TableHead>
                    <TableHead className="text-right">
                      {language === "en" ? "Actions" : "الإجراءات"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {course.image && (
                            <div className="h-10 w-10 rounded overflow-hidden">
                              <img 
                                src={course.image} 
                                alt={language === "en" ? course.title : course.titleAr} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {language === "en" ? course.title : course.titleAr}
                              {course.featured && (
                                <span className="text-yellow-500 text-xs">★</span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <span className="flex items-center">
                                <BarChart className="h-3 w-3 mr-1" />
                                {language === "en" ? course.level : 
                                  course.level === "Beginner" ? "مبتدئ" : 
                                  course.level === "Intermediate" ? "متوسط" : "متقدم"
                                }
                              </span>
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {course.students}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {course.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {course.isFree ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {language === "en" ? "Free" : "مجاني"}
                          </Badge>
                        ) : (
                          <span>
                            {new Intl.NumberFormat(language === "en" ? "en-US" : "ar-SA", {
                              style: "currency",
                              currency: course.currency
                            }).format(course.price)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {course.isPublished ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm">
                              {language === "en" ? "Published" : "منشور"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Archive className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm">
                              {language === "en" ? "Draft" : "مسودة"}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              {language === "en" ? "Actions" : "الإجراءات"}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <a href={`/courses/${course.id}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4 mr-2" />
                                {language === "en" ? "Preview" : "معاينة"}
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/courses/editor/${course.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {language === "en" ? "Edit" : "تعديل"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => archiveMutation.mutate(course.id)}>
                              <Archive className="h-4 w-4 mr-2" />
                              {language === "en" ? "Archive" : "أرشفة"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setCourseToDelete(course.id)}
                              className="text-red-600"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              {language === "en" ? "Delete" : "حذف"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter || levelFilter
                  ? language === "en" 
                      ? "No courses match your search criteria" 
                      : "لا توجد دورات تطابق معايير البحث"
                  : language === "en" 
                      ? "No courses yet. Click 'Add Course' to create one."
                      : "لا توجد دورات حتى الآن. انقر على 'إضافة دورة' لإنشاء واحدة."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!courseToDelete} 
        onOpenChange={(open) => !open && setCourseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Delete Course" : "حذف الدورة"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? "Are you sure you want to delete this course? This action cannot be undone."
                : "هل أنت متأكد من أنك تريد حذف هذه الدورة؟ لا يمكن التراجع عن هذا الإجراء."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => courseToDelete && deleteMutation.mutate(courseToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              {language === "en" ? "Delete" : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default DashboardCourses;
