
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { translateText } from "@/services/ai-service";
import { Translate } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AITranslationProps {
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  onTranslateToEnglish: (data: { title: string, excerpt: string, content: string }) => void;
  onTranslateToArabic: (data: { titleAr: string, excerptAr: string, contentAr: string }) => void;
}

export const AITranslation = ({
  title,
  titleAr,
  excerpt,
  excerptAr,
  content,
  contentAr,
  onTranslateToEnglish,
  onTranslateToArabic
}: AITranslationProps) => {
  const { language } = useLanguage();
  const [isTranslatingToEn, setIsTranslatingToEn] = useState(false);
  const [isTranslatingToAr, setIsTranslatingToAr] = useState(false);

  const handleTranslateToEnglish = async () => {
    if (!titleAr && !excerptAr && !contentAr) {
      toast({
        title: language === "en" ? "No content" : "لا يوجد محتوى",
        description: language === "en" 
          ? "Please add some Arabic content first." 
          : "يرجى إضافة بعض المحتوى العربي أولاً.",
        variant: "destructive",
      });
      return;
    }

    setIsTranslatingToEn(true);
    try {
      // Translate title
      let translatedTitle = title;
      if (titleAr) {
        translatedTitle = await translateText({
          text: titleAr,
          sourceLang: 'Arabic',
          targetLang: 'English',
        });
      }

      // Translate excerpt
      let translatedExcerpt = excerpt;
      if (excerptAr) {
        translatedExcerpt = await translateText({
          text: excerptAr,
          sourceLang: 'Arabic',
          targetLang: 'English',
        });
      }

      // Translate content
      let translatedContent = content;
      if (contentAr) {
        translatedContent = await translateText({
          text: contentAr,
          sourceLang: 'Arabic',
          targetLang: 'English',
        });
      }

      onTranslateToEnglish({
        title: translatedTitle,
        excerpt: translatedExcerpt,
        content: translatedContent
      });

      toast({
        title: language === "en" ? "Translation complete" : "اكتملت الترجمة",
        description: language === "en" 
          ? "Content translated to English successfully" 
          : "تمت ترجمة المحتوى إلى الإنجليزية بنجاح",
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: language === "en" ? "Translation failed" : "فشلت الترجمة",
        description: typeof error === 'string' 
          ? error 
          : language === "en" 
            ? "Failed to translate content. Check AI settings." 
            : "فشلت ترجمة المحتوى. تحقق من إعدادات الذكاء الاصطناعي.",
        variant: "destructive",
      });
    } finally {
      setIsTranslatingToEn(false);
    }
  };

  const handleTranslateToArabic = async () => {
    if (!title && !excerpt && !content) {
      toast({
        title: language === "en" ? "No content" : "لا يوجد محتوى",
        description: language === "en" 
          ? "Please add some English content first." 
          : "يرجى إضافة بعض المحتوى الإنجليزي أولاً.",
        variant: "destructive",
      });
      return;
    }

    setIsTranslatingToAr(true);
    try {
      // Translate title
      let translatedTitleAr = titleAr;
      if (title) {
        translatedTitleAr = await translateText({
          text: title,
          sourceLang: 'English',
          targetLang: 'Arabic',
        });
      }

      // Translate excerpt
      let translatedExcerptAr = excerptAr;
      if (excerpt) {
        translatedExcerptAr = await translateText({
          text: excerpt,
          sourceLang: 'English',
          targetLang: 'Arabic',
        });
      }

      // Translate content
      let translatedContentAr = contentAr;
      if (content) {
        translatedContentAr = await translateText({
          text: content,
          sourceLang: 'English',
          targetLang: 'Arabic',
        });
      }

      onTranslateToArabic({
        titleAr: translatedTitleAr,
        excerptAr: translatedExcerptAr,
        contentAr: translatedContentAr
      });

      toast({
        title: language === "en" ? "Translation complete" : "اكتملت الترجمة",
        description: language === "en" 
          ? "Content translated to Arabic successfully" 
          : "تمت ترجمة المحتوى إلى العربية بنجاح",
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: language === "en" ? "Translation failed" : "فشلت الترجمة",
        description: typeof error === 'string' 
          ? error 
          : language === "en" 
            ? "Failed to translate content. Check AI settings." 
            : "فشلت ترجمة المحتوى. تحقق من إعدادات الذكاء الاصطناعي.",
        variant: "destructive",
      });
    } finally {
      setIsTranslatingToAr(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleTranslateToEnglish}
        disabled={isTranslatingToEn || isTranslatingToAr}
      >
        <Translate className="h-4 w-4 mr-2" />
        {isTranslatingToEn ? (
          language === "en" ? "Translating..." : "جاري الترجمة..."
        ) : (
          language === "en" ? "Arabic → English" : "عربي → إنجليزي"
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleTranslateToArabic}
        disabled={isTranslatingToEn || isTranslatingToAr}
      >
        <Translate className="h-4 w-4 mr-2" />
        {isTranslatingToAr ? (
          language === "en" ? "Translating..." : "جاري الترجمة..."
        ) : (
          language === "en" ? "English → Arabic" : "إنجليزي → عربي"
        )}
      </Button>
    </div>
  );
};
