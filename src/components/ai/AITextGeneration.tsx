
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateText, generateImageDescription, generateSEOSuggestions } from "@/services/ai-service";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/use-toast";
import { CodeBlock, Text, LoaderCircle, Image, BarChart } from "lucide-react";

interface AITextGenerationProps {
  title?: string;
  onGenerate: (generatedText: string) => void;
}

export const AITextGeneration = ({ title = "", onGenerate }: AITextGenerationProps) => {
  const { language } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [temperature, setTemperature] = useState(0.7);

  const generateContent = async (contentType: string) => {
    if (!prompt) {
      toast({
        title: language === "en" ? "Empty prompt" : "النص فارغ",
        description: language === "en" 
          ? "Please enter a prompt first." 
          : "الرجاء إدخال نص أولاً.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      let text = "";
      
      if (contentType === "content") {
        text = await generateText({
          prompt: `Write a detailed blog post about: ${prompt}. 
          ${title ? `The blog title is: ${title}.` : ""} 
          Make it engaging, informative, and well-structured with appropriate headings and paragraphs.`,
          temperature
        });
      } else if (contentType === "image-description") {
        text = await generateImageDescription(prompt);
      } else if (contentType === "seo") {
        text = await generateSEOSuggestions(title || prompt, generatedContent || prompt);
      }

      setGeneratedContent(text);
      toast({
        title: language === "en" ? "Content generated" : "تم إنشاء المحتوى",
        description: language === "en" 
          ? "AI content has been generated successfully." 
          : "تم إنشاء محتوى الذكاء الاصطناعي بنجاح.",
      });
    } catch (error) {
      console.error('Content generation error:', error);
      toast({
        title: language === "en" ? "Generation failed" : "فشل الإنشاء",
        description: typeof error === 'string' 
          ? error 
          : language === "en" 
            ? "Failed to generate content. Check AI settings." 
            : "فشل إنشاء المحتوى. تحقق من إعدادات الذكاء الاصطناعي.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseGenerated = () => {
    if (generatedContent) {
      onGenerate(generatedContent);
      toast({
        description: language === "en" 
          ? "Generated content has been applied." 
          : "تم تطبيق المحتوى الذي تم إنشاؤه."
      });
    }
  };

  const getContentIcon = () => {
    switch (activeTab) {
      case "content":
        return <CodeBlock className="h-4 w-4 mr-2" />;
      case "image-description":
        return <Image className="h-4 w-4 mr-2" />;
      case "seo":
        return <BarChart className="h-4 w-4 mr-2" />;
      default:
        return <Text className="h-4 w-4 mr-2" />;
    }
  };
  
  const getContentButtonText = () => {
    if (isGenerating) {
      return language === "en" ? "Generating..." : "جاري الإنشاء...";
    }
    
    switch (activeTab) {
      case "content":
        return language === "en" ? "Generate Content" : "إنشاء محتوى";
      case "image-description":
        return language === "en" ? "Generate Image Description" : "إنشاء وصف صورة";
      case "seo":
        return language === "en" ? "Generate SEO Suggestions" : "إنشاء اقتراحات SEO";
      default:
        return language === "en" ? "Generate" : "إنشاء";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {language === "en" ? "AI Content Generator" : "منشئ المحتوى الذكي"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="content">
              <CodeBlock className="h-4 w-4 mr-2" />
              {language === "en" ? "Content" : "محتوى"}
            </TabsTrigger>
            <TabsTrigger value="image-description">
              <Image className="h-4 w-4 mr-2" />
              {language === "en" ? "Image Description" : "وصف الصورة"}
            </TabsTrigger>
            <TabsTrigger value="seo">
              <BarChart className="h-4 w-4 mr-2" />
              {language === "en" ? "SEO Tips" : "نصائح SEO"}
            </TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">
                {language === "en" ? "Prompt" : "النص التوجيهي"}
              </Label>
              <Textarea
                id="prompt"
                placeholder={
                  activeTab === "content"
                    ? language === "en"
                      ? "Describe the content you want to generate..."
                      : "صف المحتوى الذي تريد إنشاءه..."
                    : activeTab === "image-description"
                    ? language === "en"
                      ? "Describe the image you want to generate description for..."
                      : "صف الصورة التي تريد إنشاء وصف لها..."
                    : language === "en"
                    ? "Enter a topic for SEO suggestions..."
                    : "أدخل موضوعًا للحصول على اقتراحات SEO..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>

            {activeTab === "content" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="temperature">
                    {language === "en" ? "Creativity Level" : "مستوى الإبداع"}
                  </Label>
                  <span className="text-sm">{temperature.toFixed(1)}</span>
                </div>
                <Slider
                  id="temperature"
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{language === "en" ? "Focused" : "مركّز"}</span>
                  <span>{language === "en" ? "Balanced" : "متوازن"}</span>
                  <span>{language === "en" ? "Creative" : "إبداعي"}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between gap-2">
              <Button 
                onClick={() => generateContent(activeTab)} 
                disabled={isGenerating || !prompt}
                className="flex-1"
              >
                {isGenerating ? (
                  <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  getContentIcon()
                )}
                {getContentButtonText()}
              </Button>
            </div>
          </div>

          {generatedContent && (
            <div className="mt-6 space-y-4">
              <div className="border rounded-md p-4 bg-muted/40">
                <Label className="mb-2 block">
                  {language === "en" ? "Generated Content" : "المحتوى الذي تم إنشاؤه"}
                </Label>
                <div className="prose max-w-none dark:prose-invert whitespace-pre-wrap">
                  {generatedContent}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleUseGenerated}
                  variant="secondary"
                >
                  {language === "en" ? "Use This Content" : "استخدام هذا المحتوى"}
                </Button>
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
