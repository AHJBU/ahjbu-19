
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUpload } from "./MediaUpload";
import { Search, Trash2, Download, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getMediaFromFolder } from "@/services/mysql-file-service";
import { deleteFile } from "@/services/file-mysql-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { MediaItem } from "@/types/mediaItem";

interface MediaCenterProps {
  onSelect?: (url: string) => void;
  mediaType?: string;
}

export function MediaCenter({ onSelect, mediaType = "all" }: MediaCenterProps) {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Fetch media items from MySQL API
  const { data: mediaItems = [], isLoading } = useQuery({
    queryKey: ['mediaItems', mediaType],
    queryFn: () => getMediaFromFolder(mediaType !== "all" ? mediaType : undefined),
  });

  // Delete mutation using MySQL API
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => deleteFile(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaItems'] });
      toast({
        title: language === "en" ? "Media deleted" : "تم حذف الوسائط",
        description: language === "en" ? "The media has been deleted successfully." : "تم حذف الوسائط بنجاح.",
      });
    },
  });

  const handleDelete = (item: MediaItem) => {
    if (confirm(language === "en" ? "Are you sure you want to delete this media?" : "هل أنت متأكد من أنك تريد حذف هذه الوسائط؟")) {
      deleteMutation.mutate(item.id);
    }
  };

  const handleSelect = (url: string) => {
    if (onSelect) {
      onSelect(url);
    }
  };

  // Filter media by search term
  const filteredMedia = mediaItems.filter((item) => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.original_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by mime type
  const images = filteredMedia.filter(item => item.mime_type.startsWith('image/'));
  const videos = filteredMedia.filter(item => item.mime_type.startsWith('video/'));
  const documents = filteredMedia.filter(item => 
    item.mime_type.startsWith('application/') || 
    item.mime_type.startsWith('text/')
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="ps-10"
            placeholder={language === "en" ? "Search media..." : "البحث عن وسائط..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <MediaUpload 
          onUploadComplete={() => queryClient.invalidateQueries({ queryKey: ['mediaItems'] })}
          folder={mediaType !== "all" ? mediaType : "files"}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            {language === "en" ? "All Media" : "كل الوسائط"}
          </TabsTrigger>
          <TabsTrigger value="images">
            {language === "en" ? "Images" : "الصور"}
          </TabsTrigger>
          <TabsTrigger value="videos">
            {language === "en" ? "Videos" : "الفيديوهات"}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {language === "en" ? "Documents" : "المستندات"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {renderMediaGrid(filteredMedia, handleDelete, handleSelect, language)}
        </TabsContent>
        
        <TabsContent value="images" className="mt-4">
          {renderMediaGrid(images, handleDelete, handleSelect, language)}
        </TabsContent>
        
        <TabsContent value="videos" className="mt-4">
          {renderMediaGrid(videos, handleDelete, handleSelect, language)}
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          {renderMediaGrid(documents, handleDelete, handleSelect, language)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderMediaGrid(
  items: MediaItem[],
  onDelete: (item: MediaItem) => void,
  onSelect: (url: string) => void,
  language: string
) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {language === "en" ? "No media found" : "لم يتم العثور على وسائط"}
        </p>
      </div>
    );
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPreviewContent = (item: MediaItem) => {
    if (item.mime_type.startsWith('image/')) {
      return <img src={item.url} alt={item.original_name} className="w-full h-full object-cover" />;
    } else if (item.mime_type.startsWith('video/')) {
      return (
        <div className="flex items-center justify-center bg-black h-full">
          <video src={item.url} className="max-h-full" />
        </div>
      );
    } else {
      // Document or other file type
      const extension = item.original_name.split('.').pop()?.toUpperCase() || '';
      return (
        <div className="flex items-center justify-center bg-gray-100 h-full">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-400">{extension}</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id || item.path}
          className="group relative border rounded-md overflow-hidden"
        >
          <div className="aspect-square overflow-hidden bg-muted">
            {getPreviewContent(item)}
          </div>
          
          <div className="p-2 text-sm truncate">
            {item.original_name}
            <div className="text-xs text-muted-foreground">
              {formatFileSize(item.size)}
            </div>
          </div>

          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-white text-black hover:bg-white/80"
                onClick={() => onSelect(item.url)}
              >
                <Check className="h-4 w-4" />
                {language === "en" ? "Select" : "اختيار"}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="bg-white text-black hover:bg-white/80"
                onClick={() => onDelete(item)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
