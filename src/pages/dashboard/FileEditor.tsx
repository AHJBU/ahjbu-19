
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { MediaSelector } from "@/components/media/MediaSelector";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFile, createFile, updateFile } from "@/services/file-service";
import { MediaItem, getFile as getFirebaseFile } from "@/services/firebase-service";
import { File } from "@/types/file";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileIcon, Download } from "lucide-react";

const FileEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  
  const [file, setFile] = useState<Partial<File>>({
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    category: "Document",
    fileType: "",
    size: 0,
    date: new Date().toISOString().split('T')[0],
    downloadUrl: "",
    fullPath: "",
    featured: false
  });
  
  const [fileDetails, setFileDetails] = useState<MediaItem | null>(null);

  // Fetch file data if in edit mode
  const { data: fileData, isLoading: isLoadingFile } = useQuery({
    queryKey: ['file', id],
    queryFn: () => getFile(id!),
    enabled: !!id
  });

  // Set file data when fetched
  useEffect(() => {
    if (fileData) {
      setFile(fileData);
      
      // Get Firebase file details if we have a fullPath
      if (fileData.fullPath) {
        getFirebaseFile(fileData.fullPath)
          .then((details) => {
            setFileDetails(details);
          })
          .catch((error) => {
            console.error("Error fetching file details:", error);
          });
      }
    }
  }, [fileData]);

  // Create or update file mutation
  const mutation = useMutation({
    mutationFn: (data: Partial<File>) => {
      if (isEditMode) {
        return updateFile(id!, data);
      } else {
        return createFile(data as Omit<File, 'id'>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({
        title: language === "en" ? "Success" : "تم بنجاح",
        description: language === "en"
          ? `File ${isEditMode ? 'updated' : 'created'} successfully`
          : `تم ${isEditMode ? 'تحديث' : 'إنشاء'} الملف بنجاح`,
      });
      navigate('/dashboard/files');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file.downloadUrl || !file.title) {
      toast({
        title: language === "en" ? "Missing Information" : "معلومات ناقصة",
        description: language === "en" 
          ? "Please fill in all required fields." 
          : "الرجاء ملء جميع الحقول المطلوبة.",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(file);
  };

  const handleFileSelected = (url: string) => {
    setFile(prev => ({ ...prev, downloadUrl: url }));
    
    // Try to get file details from Firebase
    if (url) {
      const path = url.split('?')[0].split('.com/')[1];
      const fullPath = decodeURIComponent(path);
      
      getFirebaseFile(fullPath)
        .then((details) => {
          setFileDetails(details);
          setFile(prev => ({
            ...prev,
            fullPath: details.fullPath,
            fileType: details.contentType,
            size: details.size
          }));
        })
        .catch((error) => {
          console.error("Error fetching file details:", error);
          // Set minimal details if can't fetch from Firebase
          setFile(prev => ({
            ...prev,
            fullPath: fullPath || url,
            fileType: "application/octet-stream",
            size: 0
          }));
        });
    }
  };

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
      title={language === "en" 
        ? `${isEditMode ? 'Edit' : 'New'} File` 
        : `${isEditMode ? 'تعديل' : 'إضافة'} ملف`
      }
      breadcrumbs={[
        { label: language === "en" ? "Files" : "الملفات", href: "/dashboard/files" },
        { label: language === "en" ? (isEditMode ? "Edit File" : "New File") : (isEditMode ? "تعديل ملف" : "ملف جديد"), href: "#" }
      ]}
    >
      {isLoadingFile ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <Tabs defaultValue="english" className="space-y-6">
                    <TabsList>
                      <TabsTrigger value="english">
                        {language === "en" ? "English" : "الإنجليزية"}
                      </TabsTrigger>
                      <TabsTrigger value="arabic">
                        {language === "en" ? "Arabic" : "العربية"}
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* English Content */}
                    <TabsContent value="english" className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={file.title}
                            onChange={(e) => setFile({ ...file, title: e.target.value })}
                            className="mt-1"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={file.description}
                            onChange={(e) => setFile({ ...file, description: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Arabic Content */}
                    <TabsContent value="arabic" className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="titleAr">العنوان</Label>
                          <Input
                            id="titleAr"
                            value={file.titleAr}
                            onChange={(e) => setFile({ ...file, titleAr: e.target.value })}
                            className="mt-1"
                            dir="rtl"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="descriptionAr">الوصف</Label>
                          <Input
                            id="descriptionAr"
                            value={file.descriptionAr}
                            onChange={(e) => setFile({ ...file, descriptionAr: e.target.value })}
                            className="mt-1"
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar Settings */}
            <div>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  {/* File */}
                  <div>
                    <Label>{language === "en" ? "File" : "الملف"}</Label>
                    <div className="mt-2">
                      {file.downloadUrl ? (
                        <div className="p-4 border rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <FileIcon className="h-5 w-5 mr-2 text-blue-500" />
                              <span className="font-medium truncate max-w-[200px]">
                                {file.title || "File"}
                              </span>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                          
                          {fileDetails && (
                            <div className="text-sm text-muted-foreground">
                              <p>{formatFileSize(fileDetails.size)}</p>
                              <p className="truncate">{fileDetails.contentType}</p>
                            </div>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            className="w-full mt-2 text-sm"
                            type="button"
                            onClick={() => setFile({...file, downloadUrl: ""})}
                          >
                            {language === "en" ? "Change file" : "تغيير الملف"}
                          </Button>
                        </div>
                      ) : (
                        <MediaSelector
                          value={file.downloadUrl}
                          onValueChange={handleFileSelected}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* File Details */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">
                        {language === "en" ? "Category" : "التصنيف"}
                      </Label>
                      <Select
                        value={file.category}
                        onValueChange={(value) => setFile({ ...file, category: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Document">
                            {language === "en" ? "Document" : "مستند"}
                          </SelectItem>
                          <SelectItem value="Presentation">
                            {language === "en" ? "Presentation" : "عرض تقديمي"}
                          </SelectItem>
                          <SelectItem value="Spreadsheet">
                            {language === "en" ? "Spreadsheet" : "جدول بيانات"}
                          </SelectItem>
                          <SelectItem value="Archive">
                            {language === "en" ? "Archive" : "أرشيف"}
                          </SelectItem>
                          <SelectItem value="Template">
                            {language === "en" ? "Template" : "قالب"}
                          </SelectItem>
                          <SelectItem value="Other">
                            {language === "en" ? "Other" : "أخرى"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="date">
                        {language === "en" ? "Date" : "التاريخ"}
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={file.date}
                        onChange={(e) => setFile({ ...file, date: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    {/* Featured setting */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="featured">
                          {language === "en" ? "Featured File" : "ملف مميز"}
                        </Label>
                        <Switch
                          id="featured"
                          checked={file.featured}
                          onCheckedChange={(checked) => setFile({ ...file, featured: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/dashboard/files')}
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Button>
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    language === "en" ? "Saving..." : "جارِ الحفظ..."
                  ) : (
                    language === "en" ? "Save File" : "حفظ الملف"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
};

export default FileEditor;
