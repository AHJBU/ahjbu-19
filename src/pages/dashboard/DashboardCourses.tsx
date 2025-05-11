
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourses, deleteCourse } from "@/services/course-service";
import { Course } from "@/types/course";
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
import { Search, MoreVertical, PlusCircle, Edit, Trash, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardCourses = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  // Fetch courses data
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses
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

  // Filter courses by search term
  const filteredCourses = courses.filter(course => {
    const title = language === "en" ? course.title : course.titleAr;
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <DashboardLayout 
      title={language === "en" ? "Courses" : "الدورات"}
      breadcrumbs={[
        { label: language === "en" ? "Courses" : "الدورات", href: "/dashboard/courses" }
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={language === "en" ? "Search courses..." : "بحث في الدورات..."}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={() => navigate("/dashboard/courses/editor")}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {language === "en" ? "Add Course" : "إضافة دورة"}
            </Button>
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
                      {language === "en" ? "Title" : "العنوان"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Category" : "التصنيف"}
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
                      <TableCell className="font-medium">
                        {language === "en" ? course.title : course.titleAr}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {course.isFree ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                            {language === "en" ? "Free" : "مجاني"}
                          </Badge>
                        ) : (
                          <span>
                            {course.price} {course.currency}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {course.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 mr-2">
                            {language === "en" ? "Featured" : "مميز"}
                          </Badge>
                        )}
                        {course.showOrders ? (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">
                            {language === "en" ? "Public Orders" : "طلبات عامة"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-neutral-100 text-neutral-800 hover:bg-neutral-100 border-neutral-200">
                            {language === "en" ? "Hidden Orders" : "طلبات مخفية"}
                          </Badge>
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
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/courses/editor/${course.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {language === "en" ? "Edit" : "تعديل"}
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
                {searchTerm
                  ? language === "en" 
                      ? "No courses match your search term" 
                      : "لا توجد دورات تطابق بحثك"
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
