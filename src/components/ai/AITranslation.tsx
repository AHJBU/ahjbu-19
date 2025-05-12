
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
}

export function AITranslation({ text, onTranslate }: AITranslationProps) {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" /> {/* Changed from Translate to Globe */}
          {language === 'en' ? 'Translate Text' : 'ترجمة النص'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
      <CardFooter>
        <Button onClick={handleTranslate} disabled={isLoading || !text.trim()} className="w-full">
          {isLoading 
            ? (language === 'en' ? 'Translating...' : 'جاري الترجمة...')
            : (language === 'en' ? 'Translate' : 'ترجم')}
        </Button>
      </CardFooter>
    </Card>
  );
}
