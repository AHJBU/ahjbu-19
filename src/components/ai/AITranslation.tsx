
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react'; // Changed from Translate to Globe

interface AITranslationProps {
  text: string;
  onTranslate: (translatedText: string) => void;
  title?: string;
  titleAr?: string;
  excerpt?: string;
  excerptAr?: string;
  content?: string;
  contentAr?: string;
  onTranslateToEnglish?: (data: { title: string; excerpt: string; content: string; }) => void;
  onTranslateToArabic?: (data: { title: string; excerpt: string; content: string; }) => void;
}

export function AITranslation({ 
  text, 
  onTranslate,
  title,
  titleAr,
  excerpt,
  excerptAr,
  content,
  contentAr,
  onTranslateToEnglish,
  onTranslateToArabic
}: AITranslationProps) {
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('ar');
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  const handleTranslate = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      // Mock API call - replace with actual translation API
      setTimeout(() => {
        const mockTranslation = text + ` (${targetLanguage === 'ar' ? 'ترجمة' : 'translated'})`;
        setTranslatedText(mockTranslation);
        onTranslate(mockTranslation);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Translation error:', error);
      setIsLoading(false);
    }
  };

  const handleTranslateToEnglish = () => {
    if (onTranslateToEnglish && titleAr && excerptAr && contentAr) {
      setIsLoading(true);
      
      // Mock API call - replace with actual translation API
      setTimeout(() => {
        onTranslateToEnglish({
          title: `Translated from Arabic: ${titleAr}`,
          excerpt: `Translated from Arabic: ${excerptAr}`,
          content: `Translated from Arabic: ${contentAr}`,
        });
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleTranslateToArabic = () => {
    if (onTranslateToArabic && title && excerpt && content) {
      setIsLoading(true);
      
      // Mock API call - replace with actual translation API
      setTimeout(() => {
        onTranslateToArabic({
          title: `ترجمة من الإنجليزية: ${title}`,
          excerpt: `ترجمة من الإنجليزية: ${excerpt}`,
          content: `ترجمة من الإنجليزية: ${content}`,
        });
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" /> {/* Changed from Translate to Globe */}
          {language === 'en' ? 'Translate Text' : 'ترجمة النص'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(onTranslateToEnglish || onTranslateToArabic) ? (
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground">
              {language === 'en' 
                ? 'Use AI to translate your content between English and Arabic' 
                : 'استخدم الذكاء الاصطناعي لترجمة المحتوى بين الإنجليزية والعربية'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleTranslateToEnglish} 
                disabled={isLoading || !titleAr || !contentAr}
                className="flex-1"
              >
                {isLoading 
                  ? (language === 'en' ? 'Translating...' : 'جاري الترجمة...')
                  : (language === 'en' ? 'Translate to English' : 'ترجم إلى الإنجليزية')}
              </Button>
              <Button 
                onClick={handleTranslateToArabic} 
                disabled={isLoading || !title || !content}
                className="flex-1"
              >
                {isLoading 
                  ? (language === 'en' ? 'Translating...' : 'جاري الترجمة...')
                  : (language === 'en' ? 'Translate to Arabic' : 'ترجم إلى العربية')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? 'Target Language' : 'اللغة المستهدفة'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Textarea 
                placeholder={language === 'en' ? 'Translation will appear here...' : 'ستظهر الترجمة هنا...'}
                value={translatedText}
                readOnly
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleTranslate} disabled={isLoading || !text.trim()} className="w-full">
              {isLoading 
                ? (language === 'en' ? 'Translating...' : 'جاري الترجمة...')
                : (language === 'en' ? 'Translate' : 'ترجم')}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
