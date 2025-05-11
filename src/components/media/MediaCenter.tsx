
import { useState, useEffect } from "react";
import { storage } from "@/lib/firebase";
import { ref, listAll, getDownloadURL, deleteObject, getMetadata } from "firebase/storage";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { MediaUpload } from "./MediaUpload";
import { Search, Trash, FileImage, FileVideo, File, Download } from "lucide-react";

interface MediaItem {
  name: string;
  url: string;
  fullPath: string;
  contentType: string;
  size: number;
  timeCreated: string;
}

interface MediaCenterProps {
  onSelect?: (url: string) => void;
}

export function MediaCenter({ onSelect }: MediaCenterProps) {
  const { language } = useLanguage();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("images");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Function to load media from Firebase
  const loadMedia = async () => {
    setIsLoading(true);
    try {
      // Define folders to scan based on active tab
      let folderPath = "";
      if (activeTab === "images") {
        folderPath = "images";
      } else if (activeTab === "videos") {
        folderPath = "videos";
      } else if (activeTab === "files") {
        folderPath = "files";
      }

      const storageRef = ref(storage, folderPath);
      const result = await listAll(storageRef);
      
      const mediaPromises = result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        const metadata = await getMetadata(item);
        
        return {
          name: item.name,
          url,
          fullPath: item.fullPath,
          contentType: metadata.contentType || "",
          size: metadata.size || 0,
          timeCreated: metadata.timeCreated || "",
        };
      });

      const mediaData = await Promise.all(mediaPromises);
      setMediaItems(mediaData);
    } catch (error) {
      console.error("Error loading media:", error);
      toast({
        title: language === "en" ? "Error loading media" : "خطأ في تحميل الوسائط",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [activeTab]);

  const handleUploadComplete = (url: string) => {
    loadMedia(); // Refresh the media list
  };

  const handleDelete = async (item: MediaItem) => {
    try {
      const fileRef = ref(storage, item.fullPath);
      await deleteObject(fileRef);
      
      toast({
        title: language === "en" ? "File deleted" : "تم حذف الملف",
        description: language === "en" ? "The file has been removed" : "تم إزالة الملف",
      });
      
      loadMedia(); // Refresh the media list
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: language === "en" ? "Error deleting file" : "خطأ في حذف الملف",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const handleSelect = (item: MediaItem) => {
    setSelectedItem(item);
    if (onSelect) {
      onSelect(item.url);
    }
  };

  const filteredMedia = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMediaType = (contentType: string) => {
    if (contentType.startsWith("image/")) return "image";
    if (contentType.startsWith("video/")) return "video";
    return "file";
  };

  const getMediaIcon = (contentType: string) => {
    const type = getMediaType(contentType);
    
    if (type === "image") return <FileImage className="h-6 w-6 text-blue-500" />;
    if (type === "video") return <FileVideo className="h-6 w-6 text-purple-500" />;
    return <File className="h-6 w-6 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="lg:w-1/3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === "en" ? "Search media..." : "البحث في الوسائط..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="images" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        
        {["images", "videos", "files"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                {language === "en" ? "Upload New" : "رفع جديد"}
              </h3>
              <MediaUpload 
                folder={tab}
                onUploadComplete={handleUploadComplete}
                accept={tab === "images" ? "image/*" : tab === "videos" ? "video/*" : "*/*"}
                maxSizeMB={tab === "videos" ? 50 : 10}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">
                {language === "en" ? `Your ${tab}` : `${tab === "images" ? "صورك" : tab === "videos" ? "فيديوهاتك" : "ملفاتك"}`}
              </h3>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-video bg-muted animate-pulse" />
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-muted rounded animate-pulse mt-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredMedia.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredMedia.map((item) => (
                    <Card 
                      key={item.fullPath}
                      className={`overflow-hidden cursor-pointer hover:border-primary transition-all ${selectedItem?.fullPath === item.fullPath ? 'border-primary ring-1 ring-primary' : ''}`}
                      onClick={() => handleSelect(item)}
                    >
                      <div className="aspect-video overflow-hidden bg-muted flex items-center justify-center">
                        {getMediaType(item.contentType) === "image" ? (
                          <img 
                            src={item.url} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4">
                            {getMediaIcon(item.contentType)}
                            <span className="mt-2 text-xs text-muted-foreground">{item.contentType}</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="truncate flex-1">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatFileSize(item.size)} • {new Date(item.timeCreated).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex gap-2 ml-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.url, '_blank');
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 hover:bg-red-100/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item);
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
              ) : (
                <div className="text-center py-10 border rounded-lg">
                  <p className="text-muted-foreground">
                    {language === "en" 
                      ? `No ${tab} found. Upload some to get started!` 
                      : `لم يتم العثور على ${tab === "images" ? "صور" : tab === "videos" ? "فيديوهات" : "ملفات"}. قم برفع البعض للبدء!`}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
