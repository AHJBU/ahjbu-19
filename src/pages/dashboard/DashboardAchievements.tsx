
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAchievements, deleteAchievement } from "@/services/achievement-service";
import { Achievement } from "@/types/achievement";
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
import { Search, MoreVertical, PlusCircle, Edit, Trash, Award, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardAchievements = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const [achievementToDelete, setAchievementToDelete] = useState<string | null>(null);

  // Fetch achievements data
  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: getAchievements
  });

  // Delete achievement mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast({
        title: language === "en" ? "Achievement Deleted" : "تم حذف الإنجاز",
        description: language === "en"
          ? "The achievement has been deleted successfully."
          : "تم حذف الإنجاز بنجاح.",
      });
      setAchievementToDelete(null);
    },
  });

  // Get unique years
  const years = Array.from(
    new Set(
      achievements.map(achievement => new Date(achievement.date).getFullYear().toString())
    )
  ).sort((a, b) => parseInt(b) - parseInt(a));

  // Filter achievements by search term and year
  const filteredAchievements = achievements.filter(achievement => {
    const title = language === "en" ? achievement.title : achievement.titleAr;
    const description = language === "en" ? achievement.description : achievement.descriptionAr;
    
    const matchesSearch = 
      !searchTerm || 
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = !yearFilter || new Date(achievement.date).getFullYear().toString() === yearFilter;
    
    return matchesSearch && matchesYear;
  });

  return (
    <DashboardLayout 
      title={language === "en" ? "Achievements & Awards" : "الإنجازات والجوائز"}
      breadcrumbs={[
        { label: language === "en" ? "Achievements" : "الإنجازات", href: "/dashboard/achievements" }
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={language === "en" ? "Search achievements..." : "بحث في الإنجازات..."}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {years.length > 0 && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={yearFilter || ""}
                    onChange={(e) => setYearFilter(e.target.value || null)}
                    className="p-2 border rounded-md"
                  >
                    <option value="">
                      {language === "en" ? "All years" : "جميع السنوات"}
                    </option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <Button onClick={() => navigate("/dashboard/achievements/editor")}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {language === "en" ? "Add Achievement" : "إضافة إنجاز"}
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredAchievements.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {language === "en" ? "Title" : "العنوان"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Category" : "الفئة"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Date" : "التاريخ"}
                    </TableHead>
                    <TableHead className="text-right">
                      {language === "en" ? "Actions" : "الإجراءات"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAchievements.map((achievement) => (
                    <TableRow key={achievement.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {achievement.featured && (
                            <Award className="h-4 w-4 text-yellow-500" />
                          )}
                          {language === "en" ? achievement.title : achievement.titleAr}
                          {achievement.link && (
                            <a 
                              href={achievement.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 inline-flex items-center"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          achievement.category === "Award" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                          achievement.category === "Certification" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                          achievement.category === "Recognition" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                          "bg-green-100 text-green-800 hover:bg-green-100"
                        }>
                          {achievement.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(achievement.date).toLocaleDateString(
                          language === "en" ? undefined : "ar-SA"
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
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/achievements/editor/${achievement.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {language === "en" ? "Edit" : "تعديل"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setAchievementToDelete(achievement.id)}
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
                {searchTerm || yearFilter
                  ? language === "en" 
                      ? "No achievements match your search criteria" 
                      : "لا توجد إنجازات تطابق معايير البحث"
                  : language === "en" 
                      ? "No achievements yet. Click 'Add Achievement' to create one."
                      : "لا توجد إنجازات حتى الآن. انقر على 'إضافة إنجاز' لإنشاء واحد."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!achievementToDelete} 
        onOpenChange={(open) => !open && setAchievementToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Delete Achievement" : "حذف الإنجاز"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? "Are you sure you want to delete this achievement? This action cannot be undone."
                : "هل أنت متأكد من أنك تريد حذف هذا الإنجاز؟ لا يمكن التراجع عن هذا الإجراء."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => achievementToDelete && deleteMutation.mutate(achievementToDelete)}
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

export default DashboardAchievements;
