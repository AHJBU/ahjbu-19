import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Upload, X, Check, AlertCircle, FileImage } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface MediaUploaderProps {
  onUploadComplete: (url: string) => void;
  onError?: (message: string) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onUploadComplete, onError }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*, video/*',
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      onError?.('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setProgress(0);

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `media/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading file:', error);
        toast({
          title: 'Upload Failed',
          description: error.message,
          variant: 'destructive',
        });
        onError?.(error.message);
        setUploading(false);
        return;
      }

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.Key}`;
      onUploadComplete(url);
      toast({
        title: 'Upload Successful',
        description: 'File uploaded successfully!',
      });
    } catch (error: any) {
      console.error('Unexpected error during upload:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      onError?.(error.message || 'An unexpected error occurred.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <Card>
      <CardContent className="flex flex-col space-y-4">
        <div {...getRootProps()} className={`relative border-2 border-dashed rounded-md p-6 cursor-pointer ${isDragActive ? 'border-primary' : 'border-muted'}`}>
          <input {...getInputProps()} />
          <div className="text-center">
            {file ? (
              <>
                {file.type.startsWith('image/') ? (
                  <img src={previewUrl!} alt="Preview" className="max-h-48 mx-auto rounded-md" />
                ) : (
                  <div className="flex items-center justify-center h-48 bg-muted rounded-md">
                    <FileImage className="h-12 w-12 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">{file.name}</span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  {file.name} - {(file.size / 1024).toFixed(2)} KB
                </p>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isDragActive ? 'Drop the file here...' : 'Click or drag a file to upload'}
                </p>
              </>
            )}
          </div>
        </div>

        {uploading && (
          <Progress value={progress} className="w-full" />
        )}

        <div className="flex justify-end space-x-2">
          {file && (
            <Button variant="ghost" onClick={handleCancel} disabled={uploading}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
          <Button onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? (
              <>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaUploader;
