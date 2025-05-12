
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoaderCircle, Key, Lock, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { AISettings, getAISettings, saveAISettings } from "@/services/ai-service";

const AISettingsPage = () => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<AISettings>({
    apiKey: '',
    provider: 'openai',
    model: 'gpt-4o',
    endpoint: '',
  });

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const savedSettings = await getAISettings();
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error("Failed to load AI settings:", error);
        toast({
          title: language === "en" ? "Error" : "خطأ",
          description: language === "en" 
            ? "Failed to load AI settings" 
            : "فشل تحميل إعدادات الذكاء الاصطناعي",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [language]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const success = await saveAISettings(settings);
      if (success) {
        toast({
          title: language === "en" ? "Success" : "تم بنجاح",
          description: language === "en" 
            ? "AI settings saved successfully" 
            : "تم حفظ إعدادات الذكاء الاصطناعي بنجاح",
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Failed to save AI settings:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" 
          ? "Failed to save AI settings" 
          : "فشل حفظ إعدادات الذكاء الاصطناعي",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: keyof AISettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getModelOptions = () => {
    switch (settings.provider) {
      case 'openai':
        return (
          <>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
            <SelectItem value="gpt-4.5-preview">GPT-4.5-preview</SelectItem>
          </>
        );
      case 'perplexity':
        return (
          <>
            <SelectItem value="llama-3.1-sonar-small-128k-online">Llama 3.1 Sonar Small (8B)</SelectItem>
            <SelectItem value="llama-3.1-sonar-large-128k-online">Llama 3.1 Sonar Large (70B)</SelectItem>
            <SelectItem value="llama-3.1-sonar-huge-128k-online">Llama 3.1 Sonar Huge (405B)</SelectItem>
          </>
        );
      default:
        return <SelectItem value="custom">{language === "en" ? "Custom" : "مخصص"}</SelectItem>;
    }
  };

  return (
    <DashboardLayout 
      title={language === "en" ? "AI Settings" : "إعدادات الذكاء الاصطناعي"}
      breadcrumbs={[
        { label: language === "en" ? "Dashboard" : "لوحة التحكم", href: "/dashboard" },
        { label: language === "en" ? "Settings" : "الإعدادات", href: "/dashboard/settings" },
        { label: language === "en" ? "AI Settings" : "إعدادات الذكاء الاصطناعي", href: "/dashboard/settings/ai" }
      ]}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> 
              {language === "en" ? "AI Service Configuration" : "إعداد خدمة الذكاء الاصطناعي"}
            </CardTitle>
            <CardDescription>
              {language === "en" 
                ? "Configure the AI service provider and API keys for translation and text generation." 
                : "قم بتكوين مزود خدمة الذكاء الاصطناعي ومفاتيح API للترجمة وتوليد النص."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Tabs defaultValue="providers">
                <TabsList className="mb-4">
                  <TabsTrigger value="providers">
                    {language === "en" ? "AI Provider" : "مزود الذكاء الاصطناعي"}
                  </TabsTrigger>
                  <TabsTrigger value="api-keys">
                    {language === "en" ? "API Keys" : "مفاتيح API"}
                  </TabsTrigger>
                  <TabsTrigger value="advanced">
                    {language === "en" ? "Advanced" : "متقدم"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="providers" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="provider">
                        {language === "en" ? "AI Provider" : "مزود الذكاء الاصطناعي"}
                      </Label>
                      <Select 
                        value={settings.provider} 
                        onValueChange={(value) => handleChange('provider', value as 'openai' | 'perplexity' | 'custom')}
                      >
                        <SelectTrigger id="provider" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="perplexity">Perplexity AI</SelectItem>
                          <SelectItem value="custom">{language === "en" ? "Custom Provider" : "مزود مخصص"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {settings.provider !== 'custom' && (
                      <div>
                        <Label htmlFor="model">
                          {language === "en" ? "AI Model" : "نموذج الذكاء الاصطناعي"}
                        </Label>
                        <Select 
                          value={settings.model || ''} 
                          onValueChange={(value) => handleChange('model', value)}
                        >
                          <SelectTrigger id="model" className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getModelOptions()}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="api-keys" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey" className="flex items-center">
                        <Key className="h-4 w-4 mr-1" /> 
                        {language === "en" ? "API Key" : "مفتاح API"}
                      </Label>
                      <div className="relative">
                        <Input
                          id="apiKey"
                          type="password"
                          placeholder={language === "en" ? "Enter your API key" : "أدخل مفتاح API الخاص بك"}
                          value={settings.apiKey}
                          onChange={(e) => handleChange('apiKey', e.target.value)}
                        />
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language === "en"
                          ? `API key for ${settings.provider === 'openai' ? 'OpenAI' : settings.provider === 'perplexity' ? 'Perplexity' : 'custom'} services.`
                          : `مفتاح API لخدمات ${settings.provider === 'openai' ? 'OpenAI' : settings.provider === 'perplexity' ? 'Perplexity' : 'مخصصة'}.`}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                  {settings.provider === 'custom' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="endpoint">
                          {language === "en" ? "Custom API Endpoint" : "نقطة نهاية API المخصصة"}
                        </Label>
                        <Input
                          id="endpoint"
                          placeholder={language === "en" ? "https://your-custom-api.com/v1" : "https://your-custom-api.com/v1"}
                          value={settings.endpoint || ''}
                          onChange={(e) => handleChange('endpoint', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground border-t pt-4">
                    <p>
                      {language === "en"
                        ? "These settings will be used for all AI-powered features like translation and text generation."
                        : "سيتم استخدام هذه الإعدادات لجميع الميزات المدعومة بالذكاء الاصطناعي مثل الترجمة وتوليد النص."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <div className="flex justify-end mt-6 pt-4 border-t">
              <Button 
                onClick={handleSaveSettings} 
                disabled={isSaving || !settings.apiKey}
              >
                {isSaving ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> 
                    {language === "en" ? "Saving..." : "جارِ الحفظ..."}
                  </>
                ) : (
                  language === "en" ? "Save Settings" : "حفظ الإعدادات"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AISettingsPage;
