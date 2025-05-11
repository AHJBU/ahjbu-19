
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MediaCenter } from "./MediaCenter";
import { Image as ImageIcon } from "lucide-react";

export interface MediaSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  type?: string;
}

export function MediaSelector({ value, onValueChange, type = "image" }: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const handleSelect = (url: string) => {
    onValueChange(url);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    onValueChange(inputValue);
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
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" className="w-full">
                <ImageIcon className="h-4 w-4 mr-2" />
                Browse Media
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[90vw]">
              <DialogHeader>
                <DialogTitle>Select Media</DialogTitle>
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
            placeholder="Or enter URL directly"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button type="button" onClick={handleInputConfirm} variant="secondary">
            Use URL
          </Button>
        </div>
      </div>
    </div>
  );
}
