
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle } from "lucide-react";

interface AutoSaveProps {
  onSave: () => Promise<void>;
  isDirty: boolean;
  saveInterval?: number; // in milliseconds, default to 60000 (1 minute)
}

export const AutoSave = ({ 
  onSave, 
  isDirty, 
  saveInterval = 60000 
}: AutoSaveProps) => {
  const { language } = useLanguage();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  
  useEffect(() => {
    let intervalId: number;

    if (isDirty) {
      intervalId = window.setInterval(async () => {
        try {
          setIsSaving(true);
          setSaveError(null);
          
          await onSave();
          
          setLastSaved(new Date());
          toast({
            title: language === "en" ? "Autosaved" : "حفظ تلقائي",
            description: language === "en" ? "Your draft has been saved automatically." : "تم حفظ المسودة تلقائيًا.",
          });
        } catch (error) {
          console.error('Autosave error:', error);
          setSaveError(error instanceof Error ? error : new Error('Unknown error during autosave'));
          
          toast({
            title: language === "en" ? "Autosave Failed" : "فشل الحفظ التلقائي",
            description: language === "en" 
              ? "Could not save your changes. Please save manually."
              : "تعذر حفظ التغييرات. يرجى الحفظ يدويًا.",
            variant: "destructive",
          });
        } finally {
          setIsSaving(false);
        }
      }, saveInterval);
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [onSave, isDirty, saveInterval, language]);

  if (!isDirty) return null;
  
  return (
    <div className="flex items-center text-sm">
      {isSaving ? (
        <div className="flex items-center text-yellow-500">
          <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse mr-2"></div>
          {language === "en" ? "Saving..." : "جارٍ الحفظ..."}
        </div>
      ) : saveError ? (
        <div className="flex items-center text-red-500">
          <XCircle className="h-4 w-4 mr-1" />
          {language === "en" ? "Autosave failed" : "فشل الحفظ التلقائي"}
        </div>
      ) : lastSaved ? (
        <div className="flex items-center text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
          {language === "en" 
            ? `Last saved at ${lastSaved.toLocaleTimeString()}`
            : `آخر حفظ في ${lastSaved.toLocaleTimeString()}`
          }
        </div>
      ) : null}
    </div>
  );
};
