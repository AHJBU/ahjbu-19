
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";
import { MediaCenter } from "./MediaCenter";
import { Image } from "lucide-react";

interface MediaSelectorProps {
  value: string;
  onChange: (url: string) => void;
  type?: "image" | "video" | "all";
}

export function MediaSelector({ value, onChange, type = "image" }: MediaSelectorProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (url: string) => {
    onChange(url);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-4">
        {value ? (
          <div className="relative border rounded-md overflow-hidden">
            {type === "image" && (
              <img 
                src={value} 
                alt="Selected media" 
                className="w-full h-40 object-cover"
              />
            )}
            {type === "video" && (
              <video 
                src={value}
                controls
                className="w-full h-40 object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="secondary" onClick={() => setIsOpen(true)}>
                {language === "en" ? "Change" : "تغيير"}
              </Button>
            </div>
          </div>
        ) : (
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full h-40 flex flex-col items-center justify-center gap-2 border-dashed">
              <Image className="h-8 w-8 text-muted-foreground" />
              <span>
                {language === "en" 
                  ? `Select ${type === "image" ? "Image" : type === "video" ? "Video" : "Media"}`
                  : `اختر ${type === "image" ? "صورة" : type === "video" ? "فيديو" : "وسائط"}`}
              </span>
            </Button>
          </DialogTrigger>
        )}

        <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === "en" 
                ? `Select ${type === "image" ? "Image" : type === "video" ? "Video" : "Media"}`
                : `اختر ${type === "image" ? "صورة" : type === "video" ? "فيديو" : "وسائط"}`}
            </DialogTitle>
          </DialogHeader>
          <MediaCenter onSelect={handleSelect} />
        </DialogContent>
      </div>
    </Dialog>
  );
}
