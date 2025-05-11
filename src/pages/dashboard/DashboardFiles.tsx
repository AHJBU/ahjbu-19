
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFiles, deleteFile } from "@/services/file-service";
import { File } from "@/types/file";
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
import { Search, MoreVertical, PlusCircle, Edit, Trash, Download, File as FileIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardFiles = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  // Fetch files data
  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: getFiles
  });

  // Delete file mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({
        title: language === "en" ? "File Deleted" : "تم حذف الملف",
        description: language === "en"
          ? "The file has been deleted successfully."
          : "تم حذف الملف بنجاح.",
      });
      setFileToDelete(null);
    },
  });

  // Filter files by search term
  const filteredFiles = files.filter(file => {
    const title = language === "en" ? file.title : file.titleAr;
    return title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           file.category.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <DashboardLayout 
      title={language === "en" ? "Files Management" : "إدارة الملفات"}
      breadcrumbs={[
        { label: language === "en" ? "Files" : "الملفات", href: "/dashboard/files" }
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={language === "en" ? "Search files..." : "بحث في الملفات..."}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <Button onClick={() => navigate("/dashboard/file-manager")} variant="outline">
                <FileIcon className="h-4 w-4 mr-2" />
                {language === "en" ? "File Manager" : "مدير الملفات"}
              </Button>
              <Button onClick={() => navigate("/dashboard/files/editor")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                {language === "en" ? "Add File" : "إضافة ملف"}
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredFiles.length > 0 ? (
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
                      {language === "en" ? "Type" : "النوع"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Size" : "الحجم"}
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
                  {filteredFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {file.featured && (
                            <Badge variant="secondary" className="h-5">
                              {language === "en" ? "Featured" : "مميز"}
                            </Badge>
                          )}
                          {language === "en" ? file.title : file.titleAr}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{file.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {file.fileType.split('/')[1] || file.fileType}
                      </TableCell>
                      <TableCell>
                        {formatFileSize(file.size)}
                      </TableCell>
                      <TableCell>
                        {new Date(file.date).toLocaleDateString(
                          language === "en" ? undefined : "ar-SA"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                          
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
                              <DropdownMenuItem onClick={() => navigate(`/dashboard/files/editor/${file.id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {language === "en" ? "Edit" : "تعديل"}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => setFileToDelete(file.id)}
                                className="text-red-600"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                {language === "en" ? "Delete" : "حذف"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
                      ? "No files match your search term" 
                      : "لا توجد ملفات تطابق بحثك"
                  : language === "en" 
                      ? "No files yet. Click 'Add File' to create one."
                      : "لا توجد ملفات حتى الآن. انقر على 'إضافة ملف' لإنشاء واحد."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!fileToDelete} 
        onOpenChange={(open) => !open && setFileToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Delete File" : "حذف الملف"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? "Are you sure you want to delete this file? This action cannot be undone."
                : "هل أنت متأكد من أنك تريد حذف هذا الملف؟ لا يمكن التراجع عن هذا الإجراء."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => fileToDelete && deleteMutation.mutate(fileToDelete)}
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

export default DashboardFiles;
