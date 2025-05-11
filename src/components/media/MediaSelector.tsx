
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MediaCenter } from "./MediaCenter";
import { Image as ImageIcon } from "lucide-react";

export interface MediaSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onChange?: (value: string) => void; // للتوافق مع الإصدارات السابقة
  onSelectMedia?: (url: string) => void;
  onClose?: () => void;
  type?: string;
}

export function MediaSelector({ 
  value, 
  onValueChange, 
  onChange, 
  onSelectMedia, 
  onClose, 
  type = "image" 
}: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  // التعامل مع كل من onChange و onValueChange للتوافق مع الإصدارات السابقة
  const handleChange = (url: string) => {
    if (onChange) onChange(url);
    if (onValueChange) onValueChange(url);
    if (onSelectMedia) onSelectMedia(url);
  };

  const handleSelect = (url: string) => {
    handleChange(url);
    setInputValue(url);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    handleChange(inputValue);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-2">
        {value && (
          <div className="relative rounded-lg border overflow-hidden aspect-video bg-muted">
            <img
              src={value}
              alt="Selected media"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" className="w-full">
                <ImageIcon className="h-4 w-4 mr-2" />
                اختيار وسائط
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[90vw]">
              <DialogHeader>
                <DialogTitle>اختيار وسائط</DialogTitle>
              </DialogHeader>
              <div className="h-[70vh] overflow-auto">
                <MediaCenter onSelect={handleSelect} mediaType={type} />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-2">
          <Input 
            type="text" 
            placeholder="أو أدخل الرابط مباشرة"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button type="button" onClick={handleInputConfirm} variant="secondary">
            استخدام الرابط
          </Button>
        </div>
      </div>
    </div>
  );
}
