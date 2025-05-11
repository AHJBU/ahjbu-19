
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { Upload, X, File, FileImage, FileVideo } from "lucide-react";
import { uploadFile } from "@/services/mysql-file-service";

interface FileUploaderProps {
  folder: string;
  onUploadComplete: (url: string, path: string, fileType: string, size: number) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUploader({
  folder,
  onUploadComplete,
  accept = "*/*",
  maxSizeMB = 10
}: FileUploaderProps) {
  const { language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (selectedFile.size > maxSizeBytes) {
        toast({
          title: language === "en" ? "File too large" : "الملف كبير جدًا",
          description: language === "en" 
            ? `Maximum file size is ${maxSizeMB}MB` 
            : `الحد الأقصى لحجم الملف هو ${maxSizeMB} ميجابايت`,
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // For non-image files, just show the file name
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      // Upload file to MySQL backend
      const downloadUrl = await uploadFile(file, folder, (progressValue) => {
        setProgress(progressValue);
      });
      
      toast({
        title: language === "en" ? "Upload successful" : "تم الرفع بنجاح",
        description: language === "en" ? "Your file has been uploaded" : "تم رفع الملف الخاص بك",
      });
      
      // Calculate the file path
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}-${file.name}`;
      const fullPath = `${folder}/${fileName}`;
      
      setUploading(false);
      setFile(null);
      setPreview(null);
      onUploadComplete(downloadUrl, fullPath, file.type, file.size);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!file) return <File className="h-12 w-12 text-muted-foreground" />;
    
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-12 w-12 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-12 w-12 text-purple-500" />;
    } else {
      return <File className="h-12 w-12 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        {!file && (
          <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-all"
               onClick={() => fileInputRef.current?.click()}>
            <div className="text-center">
              <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">
                {language === "en" ? "Click to upload or drag & drop" : "انقر للرفع أو اسحب وأفلت"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "en" 
                  ? `${accept.replace('*', '')} (Max ${maxSizeMB}MB)` 
                  : `${accept.replace('*', '')} (الحد الأقصى ${maxSizeMB} ميجابايت)`}
              </p>
            </div>
          </div>
        )}
        
        <Input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        
        {file && (
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon()}
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <Button 
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {preview && (
              <div className="relative aspect-video w-full max-h-[200px] overflow-hidden rounded border">
                <img 
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center">{Math.round(progress)}%</p>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading 
                  ? (language === "en" ? "Uploading..." : "جاري الرفع...") 
                  : (language === "en" ? "Upload" : "رفع")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
