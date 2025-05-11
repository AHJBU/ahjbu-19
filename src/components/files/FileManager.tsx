
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMediaFromFolder, uploadFile, deleteFile as deleteFirebaseFile, MediaItem } from "@/services/firebase-service";
import { getFiles, createFile, deleteFile } from "@/services/file-service";
import { File as FileType } from "@/types/file";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { UploadCloud, Trash2, Pencil, Download, ExternalLink, File as FileIcon } from "lucide-react";

export function FileManager() {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [selectedFirebaseFile, setSelectedFirebaseFile] = useState<MediaItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newFile, setNewFile] = useState<Partial<FileType>>({
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    category: "Document",
    fileType: "",
    date: new Date().toISOString().split('T')[0],
    downloadUrl: "",
    fullPath: "",
    size: 0,
    featured: false
  });
  
  // Get files from Supabase
  const { data: files = [], isLoading: isLoadingFiles } = useQuery({
    queryKey: ["files"],
    queryFn: getFiles
  });
  
  // Get files from Firebase
  const { data: firebaseFiles = [], isLoading: isLoadingFirebase } = useQuery({
    queryKey: ["firebase-files"],
    queryFn: () => getMediaFromFolder("files")
  });
  
  // Add a new file to Supabase
  const addFileMutation = useMutation({
    mutationFn: (file: Omit<FileType, "id">) => createFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast({
        title: language === "en" ? "File Added" : "تمت إضافة الملف",
        description: language === "en" 
          ? "The file has been added successfully." 
          : "تم إضافة الملف بنجاح.",
      });
      setIsAddDialogOpen(false);
      resetNewFile();
    }
  });
  
  // Delete a file from Supabase
  const deleteFileMutation = useMutation({
    mutationFn: (id: string) => deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast({
        title: language === "en" ? "File Deleted" : "تم حذف الملف",
        description: language === "en" 
          ? "The file reference has been deleted." 
          : "تم حذف إشارة الملف.",
      });
      setDeleteDialogOpen(false);
    }
  });
  
  // Delete a file from Firebase
  const deleteFirebaseMutation = useMutation({
    mutationFn: (path: string) => deleteFirebaseFile(path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firebase-files"] });
      toast({
        title: language === "en" ? "File Deleted" : "تم حذف الملف",
        description: language === "en" 
          ? "The file has been deleted from storage." 
          : "تم حذف الملف من التخزين.",
      });
    }
  });
  
  // Upload file to Firebase
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsUploading(true);
    
    try {
      const downloadUrl = await uploadFile(file, "files", (progress) => {
        setUploadProgress(progress);
      });
      
      // Set file info in the form
      const now = new Date().toISOString();
      setNewFile({
        ...newFile,
        title: file.name.split('.')[0] || "Untitled",
        downloadUrl,
        fullPath: `files/${file.name}`,
        fileType: file.type,
        size: file.size,
        date: now.split('T')[0]
      });
      
      toast({
        title: language === "en" ? "File Uploaded" : "تم رفع الملف",
        description: language === "en" 
          ? "File uploaded successfully to storage." 
          : "تم رفع الملف بنجاح إلى التخزين.",
      });
      
      // Refresh the Firebase files list
      queryClient.invalidateQueries({ queryKey: ["firebase-files"] });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: language === "en" ? "Upload Error" : "خطأ في الرفع",
        description: language === "en" 
          ? "There was an error uploading the file." 
          : "حدث خطأ أثناء رفع الملف.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Add existing Firebase file to Supabase
  const addExistingFile = (fileData: MediaItem) => {
    setSelectedFirebaseFile(fileData);
    setNewFile({
      ...newFile,
      title: fileData.name.split('.')[0] || "Untitled",
      downloadUrl: fileData.url,
      fullPath: fileData.fullPath,
      fileType: fileData.contentType,
      size: fileData.size,
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(true);
  };
  
  // Reset new file form
  const resetNewFile = () => {
    setNewFile({
      title: "",
      titleAr: "",
      description: "",
      descriptionAr: "",
      category: "Document",
      fileType: "",
      date: new Date().toISOString().split('T')[0],
      downloadUrl: "",
      fullPath: "",
      size: 0,
      featured: false
    });
    setSelectedFirebaseFile(null);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile.downloadUrl || !newFile.title) {
      toast({
        title: language === "en" ? "Missing Information" : "معلومات ناقصة",
        description: language === "en" 
          ? "Please fill in all required fields." 
          : "الرجاء ملء جميع الحقول المطلوبة.",
        variant: "destructive",
      });
      return;
    }
    
    addFileMutation.mutate(newFile as Omit<FileType, "id">);
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Delete confirmation for Supabase file reference
  const confirmDeleteFile = (file: FileType) => {
    setSelectedFile(file);
    setDeleteDialogOpen(true);
  };
  
  // Delete both Firebase file and Supabase reference
  const deleteCompleteFile = async (file: FileType) => {
    try {
      // First delete the Firebase file
      await deleteFirebaseMutation.mutateAsync(file.fullPath);
      
      // Then delete the Supabase reference
      await deleteFileMutation.mutateAsync(file.id);
      
      toast({
        title: language === "en" ? "File Completely Deleted" : "تم حذف الملف بالكامل",
        description: language === "en" 
          ? "The file has been deleted from both storage and database." 
          : "تم حذف الملف من التخزين وقاعدة البيانات.",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: language === "en" ? "Delete Error" : "خطأ في الحذف",
        description: language === "en" 
          ? "There was an error deleting the file." 
          : "حدث خطأ أثناء حذف الملف.",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs defaultValue="manage">
      <TabsList className="mb-6">
        <TabsTrigger value="manage">
          {language === "en" ? "Manage Files" : "إدارة الملفات"}
        </TabsTrigger>
        <TabsTrigger value="upload">
          {language === "en" ? "Upload Files" : "رفع الملفات"}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="manage" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {language === "en" ? "Available Files" : "الملفات المتاحة"}
          </h2>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            {language === "en" ? "Add New File" : "إضافة ملف جديد"}
          </Button>
        </div>
        
        {isLoadingFiles ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : files.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === "en" ? "Title" : "العنوان"}</TableHead>
                  <TableHead>{language === "en" ? "Category" : "الفئة"}</TableHead>
                  <TableHead>{language === "en" ? "Type" : "النوع"}</TableHead>
                  <TableHead>{language === "en" ? "Size" : "الحجم"}</TableHead>
                  <TableHead>{language === "en" ? "Date" : "التاريخ"}</TableHead>
                  <TableHead className="text-right">{language === "en" ? "Actions" : "الإجراءات"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{language === "en" ? file.title : file.titleAr}</TableCell>
                    <TableCell>{file.category}</TableCell>
                    <TableCell>{file.fileType.split('/')[1] || file.fileType}</TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>
                      {new Date(file.date).toLocaleDateString(
                        language === "en" ? undefined : "ar-SA"
                      )}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => confirmDeleteFile(file)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 border rounded-md">
            <FileIcon className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">
              {language === "en" ? "No files have been added yet." : "لم يتم إضافة أي ملفات بعد."}
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              {language === "en" ? "Add your first file" : "إضافة ملفك الأول"}
            </Button>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "en" ? "Upload New File" : "رفع ملف جديد"}
            </CardTitle>
            <CardDescription>
              {language === "en" 
                ? "Upload files to your storage. Supported formats: PDF, DOCX, XLSX, ZIP, images, etc." 
                : "رفع الملفات إلى التخزين الخاص بك. الصيغ المدعومة: PDF، DOCX، XLSX، ZIP، الصور، إلخ."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {language === "en"
                    ? "Drag and drop your file here, or click to select"
                    : "اسحب وأفلت الملف هنا، أو اضغط للتحديد"
                  }
                </p>
                <Input 
                  type="file"
                  className="mt-4 mx-auto max-w-xs"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                {isUploading && (
                  <div className="mt-4">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-sm text-center">
                      {uploadProgress.toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "en" ? "Existing Files in Storage" : "الملفات الموجودة في التخزين"}
                </h3>
                
                {isLoadingFirebase ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : firebaseFiles.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === "en" ? "File name" : "اسم الملف"}</TableHead>
                          <TableHead>{language === "en" ? "Type" : "النوع"}</TableHead>
                          <TableHead>{language === "en" ? "Size" : "الحجم"}</TableHead>
                          <TableHead>{language === "en" ? "Date" : "التاريخ"}</TableHead>
                          <TableHead className="text-right">{language === "en" ? "Actions" : "الإجراءات"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {firebaseFiles.map((file) => (
                          <TableRow key={file.fullPath}>
                            <TableCell className="font-medium">{file.name}</TableCell>
                            <TableCell>{file.contentType.split('/')[1] || file.contentType}</TableCell>
                            <TableCell>{formatFileSize(file.size)}</TableCell>
                            <TableCell>
                              {new Date(file.timeCreated).toLocaleDateString(
                                language === "en" ? undefined : "ar-SA"
                              )}
                            </TableCell>
                            <TableCell className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => addExistingFile(file)}
                              >
                                {language === "en" ? "Add to Files" : "إضافة للملفات"}
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => deleteFirebaseMutation.mutate(file.fullPath)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded-md">
                    <FileIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">
                      {language === "en" ? "No files found in storage." : "لم يتم العثور على ملفات في التخزين."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Add File Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Add New File" : "إضافة ملف جديد"}
            </DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Add file details to make it available for download."
                : "أضف تفاصيل الملف لجعله متاحًا للتنزيل."
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="english" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="arabic">العربية</TabsTrigger>
                </TabsList>
                
                <TabsContent value="english" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={newFile.title} 
                      onChange={(e) => setNewFile({...newFile, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description" 
                      value={newFile.description} 
                      onChange={(e) => setNewFile({...newFile, description: e.target.value})}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="arabic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleAr">العنوان</Label>
                    <Input 
                      id="titleAr" 
                      value={newFile.titleAr} 
                      onChange={(e) => setNewFile({...newFile, titleAr: e.target.value})}
                      dir="rtl"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descriptionAr">الوصف</Label>
                    <Input 
                      id="descriptionAr" 
                      value={newFile.descriptionAr} 
                      onChange={(e) => setNewFile({...newFile, descriptionAr: e.target.value})}
                      dir="rtl"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newFile.category} 
                  onValueChange={(value) => setNewFile({...newFile, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date"
                  type="date"
                  value={newFile.date}
                  onChange={(e) => setNewFile({...newFile, date: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newFile.featured}
                  onChange={(e) => setNewFile({...newFile, featured: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  {language === "en" ? "Feature this file" : "تمييز هذا الملف"}
                </Label>
              </div>
              
              {selectedFirebaseFile && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">{language === "en" ? "Selected file:" : "الملف المحدد:"}</p>
                  <p className="text-sm truncate">{selectedFirebaseFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFirebaseFile.size)} • {selectedFirebaseFile.contentType}
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => {
                setIsAddDialogOpen(false);
                resetNewFile();
              }}>
                {language === "en" ? "Cancel" : "إلغاء"}
              </Button>
              <Button type="submit" disabled={addFileMutation.isPending}>
                {addFileMutation.isPending
                  ? language === "en" ? "Saving..." : "جاري الحفظ..."
                  : language === "en" ? "Save File" : "حفظ الملف"
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Delete File" : "حذف الملف"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? "Are you sure you want to delete this file entry? This will only remove the reference, not the actual file in storage."
                : "هل أنت متأكد من حذف إشارة هذا الملف؟ هذا سيزيل المرجع فقط، وليس الملف الفعلي في التخزين."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700" 
              onClick={() => selectedFile && deleteFileMutation.mutate(selectedFile.id)}
            >
              {language === "en" ? "Delete reference" : "حذف المرجع"}
            </AlertDialogAction>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90" 
              onClick={() => selectedFile && deleteCompleteFile(selectedFile)}
            >
              {language === "en" ? "Delete completely" : "حذف بالكامل"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  );
}
