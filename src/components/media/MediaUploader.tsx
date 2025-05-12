
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X } from 'lucide-react';

interface MediaUploaderProps {
  onUploadComplete?: (files: Array<{ path: string }>) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxSize?: number;
}

export function MediaUploader({
  onUploadComplete,
  maxFiles = 5,
  acceptedFileTypes = ['image/*', 'application/pdf'],
  maxSize = 5000000, // 5MB
}: MediaUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length + files.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `You can only upload a maximum of ${maxFiles} files at once.`,
        variant: 'destructive',
      });
      return;
    }

    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, [files, maxFiles, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files.length) return;
    
    setUploading(true);
    setProgress(0);
    
    // Mock upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      // Mock API call - replace with actual upload API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response with file URLs
      const uploadedFiles = files.map(file => ({
        path: URL.createObjectURL(file)
      }));
      
      if (onUploadComplete) {
        onUploadComplete(uploadedFiles);
      }
      
      toast({
        title: 'Upload complete',
        description: `Successfully uploaded ${files.length} file(s).`,
      });
      
      setFiles([]);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your files.',
        variant: 'destructive',
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <h3 className="font-medium text-lg">Drag & drop files here</h3>
          <p className="text-sm text-muted-foreground">
            or click to select files (max {maxFiles} files, {maxSize / 1000000}MB each)
          </p>
        </div>
      </div>

      {!!files.length && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Selected files ({files.length}):</div>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-muted p-2 rounded-md text-sm"
              >
                <span className="truncate max-w-[80%]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && !uploading && (
        <Button onClick={handleUpload} className="w-full">
          Upload {files.length} file{files.length > 1 ? 's' : ''}
        </Button>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}
    </div>
  );
}
