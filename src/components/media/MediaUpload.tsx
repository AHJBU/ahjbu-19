
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/use-toast";

interface MediaUploadProps {
  onUploadComplete?: () => void;
  folder?: string;
}

export function MediaUpload({ onUploadComplete, folder = "files" }: MediaUploadProps) {
  const { language } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(0);

    // Create form data
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Upload to server
      const xhr = new XMLHttpRequest();
      
      xhr.open("POST", `/api/upload/${folder}`);
      
      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      });

      // Handle completion
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          toast({
            title: language === "en" ? "Upload Complete" : "تم الرفع",
            description: language === "en" 
              ? `${selectedFile.name} has been uploaded successfully.`
              : `تم رفع ${selectedFile.name} بنجاح.`,
          });
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          if (onUploadComplete) {
            onUploadComplete();
          }
        } else {
          handleUploadError();
        }
        setIsUploading(false);
      };

      // Handle errors
      xhr.onerror = () => {
        handleUploadError();
        setIsUploading(false);
      };

      // Send the request
      xhr.send(formData);
    } catch (error) {
      handleUploadError();
      setIsUploading(false);
    }
  };

  const handleUploadError = () => {
    toast({
      title: language === "en" ? "Upload Failed" : "فشل الرفع",
      description: language === "en" 
        ? "There was an error uploading your file. Please try again."
        : "حدث خطأ أثناء رفع الملف. يرجى المحاولة مرة أخرى.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {language === "en" ? "Select File" : "اختر ملف"}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </Button>
        
        {selectedFile && !isUploading && (
          <Button 
            variant="default"
            onClick={handleUpload}
          >
            {language === "en" ? "Upload" : "رفع"}
          </Button>
        )}
      </div>

      {selectedFile && (
        <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
          <div className="flex-1 truncate">{selectedFile.name}</div>
          {!isUploading && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearFile}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="text-xs text-right text-muted-foreground">
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
}
