
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublications, deletePublication, archivePublication, restorePublication } from "@/services/publication-service";
import { Publication } from "@/types/publication";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MoreVertical, PlusCircle, Edit, Trash, Archive, RefreshCw, Calendar, ExternalLink, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardPublications = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [publicationToDelete, setPublicationToDelete] = useState<string | null>(null);

  // Fetch publications data
  const { data: publications = [], isLoading } = useQuery({
    queryKey: ['publications'],
    queryFn: getPublications
  });

  // Archive publication mutation
  const archiveMutation = useMutation({
    mutationFn: (id: string) => archivePublication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast({
        title: language === "en" ? "Publication Archived" : "تم أرشفة المنشور",
        description: language === "en"
          ? "The publication has been archived successfully."
          : "تم أرشفة المنشور بنجاح.",
      });
    },
  });

  // Restore publication mutation
  const restoreMutation = useMutation({
    mutationFn: (id: string) => restorePublication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast({
        title: language === "en" ? "Publication Restored" : "تم استعادة المنشور",
        description: language === "en"
          ? "The publication has been restored successfully."
          : "تم استعادة المنشور بنجاح.",
      });
    },
  });

  // Delete publication mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePublication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast({
        title: language === "en" ? "Publication Deleted" : "تم حذف المنشور",
        description: language === "en"
          ? "The publication has been deleted permanently."
          : "تم حذف المنشور بشكل نهائي.",
      });
      setPublicationToDelete(null);
    },
  });

  // Get unique categories
  const categories = Array.from(new Set(publications.map(pub => pub.category)));

  // Filter publications by search term, category, and archived status
  const filteredPublications = publications.filter(publication => {
    const title = language === "en" ? publication.title : publication.titleAr;
    const abstract = language === "en" ? publication.abstract : publication.abstractAr;
    
    const matchesSearch = 
      !searchTerm || 
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publication.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || publication.category === categoryFilter;
    
    // Check if active or archived based on current tab
    const matchesTab = activeTab === "active" ? !publication.archived : publication.archived;
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <DashboardLayout 
      title={language === "en" ? "Publications & Research" : "المنشورات والأبحاث"}
      breadcrumbs={[
        { label: language === "en" ? "Publications" : "المنشورات", href: "/dashboard/publications" }
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={language === "en" ? "Search publications..." : "بحث في المنشورات..."}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
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
            </div>
            
            <Button onClick={() => navigate("/dashboard/publications/editor")}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {language === "en" ? "Add Publication" : "إضافة منشور"}
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">
                {language === "en" ? "Active Publications" : "المنشورات النشطة"}
              </TabsTrigger>
              <TabsTrigger value="archived">
                {language === "en" ? "Archive" : "الأرشيف"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredPublications.length > 0 ? (
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
                      {filteredPublications.map((publication) => (
                        <TableRow key={publication.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {publication.featured && (
                                <span className="text-yellow-500 text-xs">★</span>
                              )}
                              {language === "en" ? publication.title : publication.titleAr}
                              {publication.link && (
                                <a 
                                  href={publication.link} 
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
                            <Badge variant="outline">
                              {publication.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(publication.date).toLocaleDateString(
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
                                <DropdownMenuItem onClick={() => navigate(`/dashboard/publications/editor/${publication.id}`)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  {language === "en" ? "Edit" : "تعديل"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => archiveMutation.mutate(publication.id)}>
                                  <Archive className="h-4 w-4 mr-2" />
                                  {language === "en" ? "Archive" : "أرشفة"}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => setPublicationToDelete(publication.id)}
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
                    {searchTerm || categoryFilter
                      ? language === "en" 
                          ? "No publications match your search criteria" 
                          : "لا توجد منشورات تطابق معايير البحث"
                      : language === "en" 
                          ? "No publications yet. Click 'Add Publication' to create one."
                          : "لا توجد منشورات حتى الآن. انقر على 'إضافة منشور' لإنشاء واحد."
                    }
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="archived">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredPublications.length > 0 ? (
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
                      {filteredPublications.map((publication) => (
                        <TableRow key={publication.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {language === "en" ? publication.title : publication.titleAr}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {publication.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(publication.date).toLocaleDateString(
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
                                <DropdownMenuItem onClick={() => restoreMutation.mutate(publication.id)}>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  {language === "en" ? "Restore" : "استعادة"}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => setPublicationToDelete(publication.id)}
                                  className="text-red-600"
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  {language === "en" ? "Delete Permanently" : "حذف نهائياً"}
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
                    {language === "en" 
                      ? "No archived publications found." 
                      : "لا توجد منشورات مؤرشفة."
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!publicationToDelete} 
        onOpenChange={(open) => !open && setPublicationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Delete Publication" : "حذف المنشور"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? "Are you sure you want to delete this publication? This action cannot be undone."
                : "هل أنت متأكد من أنك تريد حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => publicationToDelete && deleteMutation.mutate(publicationToDelete)}
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

export default DashboardPublications;
