
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, File, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '@/lib/firebase';

interface MediaUploaderProps {
  onUploadComplete?: (url: string) => void;
  folder?: string;
  acceptedTypes?: string;
}

export function MediaUploader({ onUploadComplete, folder = "images", acceptedTypes = "image/*" }: MediaUploaderProps) {
  const { language } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storage = getStorage(app);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type if acceptedTypes is provided
      if (acceptedTypes && !file.type.match(acceptedTypes.replace(/\*/g, '.*'))) {
        setError(language === 'en' 
          ? `Invalid file type. Please upload ${acceptedTypes}.` 
          : `نوع ملف غير صالح. يرجى تحميل ${acceptedTypes}.`);
        return;
      }
      
      // Validate file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(language === 'en' 
          ? 'File is too large. Maximum size is 10MB.' 
          : 'الملف كبير جداً. الحد الأقصى هو 10 ميجابايت.');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      // Create file path in Firebase Storage
      const timestamp = Date.now();
      const fileExtension = selectedFile.name.split('.').pop() || '';
      const fileName = `${timestamp}-${selectedFile.name.replace(`.${fileExtension}`, '')}.${fileExtension}`;
      const filePath = `${folder}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      // Create upload task
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      
      // Monitor upload progress
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setError(language === 'en' 
            ? 'Error uploading file. Please try again.' 
            : 'خطأ في تحميل الملف. يرجى المحاولة مرة أخرى.');
          setIsUploading(false);
        },
        async () => {
          // Upload complete
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            if (onUploadComplete) {
              onUploadComplete(downloadURL);
            }
            toast({
              title: language === 'en' ? 'Upload Complete' : 'تم التحميل',
              description: language === 'en' 
                ? `${selectedFile.name} has been uploaded successfully.` 
                : `تم تحميل ${selectedFile.name} بنجاح.`,
            });
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          } catch (error) {
            console.error('Error getting download URL:', error);
            setError(language === 'en' 
              ? 'Error getting download URL. Please try again.' 
              : 'خطأ في الحصول على عنوان URL للتنزيل. يرجى المحاولة مرة أخرى.');
          }
          setIsUploading(false);
        }
      );
    } catch (error) {
      console.error('Upload setup error:', error);
      setError(language === 'en' 
        ? 'Error setting up upload. Please try again.' 
        : 'خطأ في إعداد التحميل. يرجى المحاولة مرة أخرى.');
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === 'en' ? 'Error' : 'خطأ'}
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Select File' : 'اختر ملف'}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptedTypes}
            disabled={isUploading}
          />
        </Button>
        
        {selectedFile && !isUploading && (
          <Button 
            variant="default"
            onClick={handleUpload}
          >
            {language === 'en' ? 'Upload' : 'رفع'}
          </Button>
        )}
      </div>

      {selectedFile && (
        <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
          <File className="h-4 w-4 flex-shrink-0" />
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
