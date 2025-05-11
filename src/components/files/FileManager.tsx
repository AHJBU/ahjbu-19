
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { MediaUpload } from "@/components/media/MediaUpload";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFilesFromFolder, deleteFile } from "@/services/file-service";
import { File as FileType } from "@/types/file";
import { FileImage, FileText, FileVideo, File, Trash, Download, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface FileManagerProps {
  onSelectFile?: (file: FileType) => void;
}

export function FileManager({ onSelectFile }: FileManagerProps) {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("files");
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  // Fetch files data
  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files', activeTab],
    queryFn: () => getFilesFromFolder(activeTab)
  });

  // Delete file mutation
  const deleteMutation = useMutation({
    mutationFn: (path: string) => deleteFile(path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', activeTab] });
      toast({
        title: language === "en" ? "File Deleted" : "تم حذف الملف",
        description: language === "en"
          ? "The file has been deleted successfully."
          : "تم حذف الملف بنجاح.",
      });
      setFileToDelete(null);
    },
  });

  // Get unique categories
  const categories = [...new Set(files.map(file => file.category))];

  // Filter files by search term and category
  const filteredFiles = files.filter(file => {
    const title = language === "en" ? file.title : file.titleAr;
    const description = language === "en" ? file.description : file.descriptionAr;
    
    const matchesSearch = searchTerm
      ? title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesCategory = activeCategory
      ? file.category === activeCategory
      : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = () => {
    queryClient.invalidateQueries({ queryKey: ['files', activeTab] });
    toast({
      title: language === "en" ? "File Uploaded" : "تم رفع الملف",
      description: language === "en"
        ? "The file has been uploaded successfully."
        : "تم رفع الملف بنجاح.",
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <FileImage className="h-6 w-6 text-blue-500" />;
    if (fileType.includes('video')) return <FileVideo className="h-6 w-6 text-purple-500" />;
    if (fileType.includes('pdf')) return <FileText className="h-6 w-6 text-red-500" />;
    return <File className="h-6 w-6 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="lg:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={language === "en" ? "Search files..." : "بحث في الملفات..."}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {language === "en" ? "Filter:" : "تصفية:"}
            </span>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activeCategory === null ? "secondary" : "outline"} 
                size="sm"
                onClick={() => setActiveCategory(null)}
              >
                {language === "en" ? "All" : "الكل"}
              </Button>
              
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="files" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="images">
            {language === "en" ? "Images" : "الصور"}
          </TabsTrigger>
          <TabsTrigger value="videos">
            {language === "en" ? "Videos" : "الفيديوهات"}
          </TabsTrigger>
          <TabsTrigger value="files">
            {language === "en" ? "Files" : "الملفات"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">
                {language === "en" ? "Upload New Image" : "رفع صورة جديدة"}
              </h3>
              <MediaUpload 
                folder="images"
                onUploadComplete={handleFileUpload}
                accept="image/*"
                maxSizeMB={5}
              />
            </CardContent>
          </Card>
          
          <FileGrid 
            files={filteredFiles}
            isLoading={isLoading}
            onSelectFile={onSelectFile}
            onDeleteFile={(path) => setFileToDelete(path)}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            language={language}
          />
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">
                {language === "en" ? "Upload New Video" : "رفع فيديو جديد"}
              </h3>
              <MediaUpload 
                folder="videos"
                onUploadComplete={handleFileUpload}
                accept="video/*"
                maxSizeMB={50}
              />
            </CardContent>
          </Card>
          
          <FileGrid 
            files={filteredFiles}
            isLoading={isLoading}
            onSelectFile={onSelectFile}
            onDeleteFile={(path) => setFileToDelete(path)}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            language={language}
          />
        </TabsContent>
        
        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">
                {language === "en" ? "Upload New File" : "رفع ملف جديد"}
              </h3>
              <MediaUpload 
                folder="files"
                onUploadComplete={handleFileUpload}
                accept="*"
                maxSizeMB={10}
              />
            </CardContent>
          </Card>
          
          <FileGrid 
            files={filteredFiles}
            isLoading={isLoading}
            onSelectFile={onSelectFile}
            onDeleteFile={(path) => setFileToDelete(path)}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            language={language}
          />
        </TabsContent>
      </Tabs>

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
    </div>
  );
}

interface FileGridProps {
  files: FileType[];
  isLoading: boolean;
  onSelectFile?: (file: FileType) => void;
  onDeleteFile: (path: string) => void;
  getFileIcon: (fileType: string) => JSX.Element;
  formatFileSize: (bytes: number) => string;
  language: string;
}

function FileGrid({ 
  files, 
  isLoading, 
  onSelectFile, 
  onDeleteFile, 
  getFileIcon, 
  formatFileSize, 
  language 
}: FileGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video bg-muted animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">
          {language === "en" 
            ? "No files found. Upload some to get started!" 
            : "لم يتم العثور على ملفات. قم برفع البعض للبدء!"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map((file) => (
        <Card
          key={file.id}
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectFile && onSelectFile(file)}
        >
          <div className="aspect-video overflow-hidden bg-muted flex items-center justify-center">
            {file.fileType === 'image' || file.fileType === 'png' || file.fileType === 'jpg' || file.fileType === 'jpeg' ? (
              <img 
                src={file.downloadUrl} 
                alt={file.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                {getFileIcon(file.fileType)}
                <span className="mt-2 text-xs text-muted-foreground">.{file.fileType}</span>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <Badge variant="outline">
                  {file.category}
                </Badge>
                {file.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    {language === "en" ? "Featured" : "مميز"}
                  </Badge>
                )}
              </div>
              
              <h3 className="font-medium text-sm mt-2 truncate">
                {language === "en" ? file.title : file.titleAr}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {formatFileSize(file.size)} • {new Date(file.date).toLocaleDateString()}
              </p>
              
              <div className="flex justify-end gap-2 mt-2">
                <Button size="icon" variant="ghost" onClick={(e) => {
                  e.stopPropagation();
                  window.open(file.downloadUrl, "_blank");
                }}>
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-700" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.fullPath);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
