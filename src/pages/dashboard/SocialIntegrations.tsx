
import React, { useState, useEffect } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoaderCircle, Send, Globe, ArrowUpFromLine, ArrowDownToLine, Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  saveWebhookConfigurations,
  getWebhookConfigurations,
  publishToSocialMedia,
  getPublications,
} from '@/services/publication-service';
import { Publication } from '@/types/publication';
import { useQuery, useMutation } from "@tanstack/react-query";

const SocialIntegrations: React.FC = () => {
  const { language } = useLanguage();
  const [makeWebhookUrl, setMakeWebhookUrl] = useState('');
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('');
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState('');
  const [customWebhookUrl, setCustomWebhookUrl] = useState('');
  const [selectedPublication, setSelectedPublication] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'facebook', 'linkedin']);
  const [isSending, setIsSending] = useState(false);
  
  // Fetch publications
  const { data: publications = [] } = useQuery({
    queryKey: ['publications'],
    queryFn: getPublications
  });
  
  // Initialize webhook configurations
  useEffect(() => {
    const configs = getWebhookConfigurations();
    setMakeWebhookUrl(configs.makeWebhookUrl);
    setN8nWebhookUrl(configs.n8nWebhookUrl);
    setZapierWebhookUrl(configs.zapierWebhookUrl);
    setCustomWebhookUrl(configs.customWebhookUrl);
  }, []);

  // Save webhook configurations
  const handleSaveWebhooks = () => {
    saveWebhookConfigurations({
      makeWebhookUrl,
      n8nWebhookUrl,
      zapierWebhookUrl,
      customWebhookUrl
    });
    
    toast({
      title: language === 'en' ? 'Configurations Saved' : 'تم حفظ الإعدادات',
      description: language === 'en' 
        ? 'Your webhook configurations have been saved successfully.'
        : 'تم حفظ إعدادات ويب هوك بنجاح.'
    });
  };

  // Toggle platform selection
  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  // Publish to social media
  const handlePublish = async () => {
    if (!selectedPublication) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Please select a publication to share.'
          : 'الرجاء اختيار منشور للمشاركة.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Set the social media webhook URL to localStorage for the service to use
      if (makeWebhookUrl) {
        localStorage.setItem('socialMediaWebhookUrl', makeWebhookUrl);
      } else if (n8nWebhookUrl) {
        localStorage.setItem('socialMediaWebhookUrl', n8nWebhookUrl);
      } else if (zapierWebhookUrl) {
        localStorage.setItem('socialMediaWebhookUrl', zapierWebhookUrl);
      } else if (customWebhookUrl) {
        localStorage.setItem('socialMediaWebhookUrl', customWebhookUrl);
      } else {
        throw new Error('No webhook URL configured');
      }
      
      const result = await publishToSocialMedia(selectedPublication, selectedPlatforms);
      
      if (result) {
        toast({
          title: language === 'en' ? 'Success' : 'تم بنجاح',
          description: language === 'en' 
            ? 'Your publication has been shared to social media platforms.'
            : 'تمت مشاركة المنشور على منصات التواصل الاجتماعي.'
        });
      } else {
        throw new Error('Failed to publish');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Failed to share to social media. Please check your webhook configurations.'
          : 'فشل في المشاركة على وسائل التواصل الاجتماعي. يرجى التحقق من تكوينات الويب هوك.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  // Webhook test function
  const testWebhook = async (url: string) => {
    if (!url) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Please enter a webhook URL to test.'
          : 'الرجاء إدخال عنوان URL لويب هوك للاختبار.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const testPayload = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'This is a test from the publications system'
      };
      
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
        mode: 'no-cors'
      });
      
      toast({
        title: language === 'en' ? 'Test Sent' : 'تم إرسال الاختبار',
        description: language === 'en' 
          ? 'Test webhook request sent. Check your automation service to confirm receipt.'
          : 'تم إرسال طلب ويب هوك الاختبار. تحقق من خدمة الأتمتة للتأكد من الاستلام.'
      });
    } catch (error) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Failed to send test webhook. Check URL and try again.'
          : 'فشل في إرسال ويب هوك الاختبار. تحقق من عنوان URL وحاول مرة أخرى.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <DashboardLayout
      title={language === 'en' ? 'Social Media Integrations' : 'تكامل وسائل التواصل الاجتماعي'}
      breadcrumbs={[
        { label: language === 'en' ? 'Dashboard' : 'لوحة التحكم', href: '/dashboard' },
        { label: language === 'en' ? 'Social Integrations' : 'تكامل وسائل التواصل', href: '/dashboard/social-integrations' }
      ]}
    >
      <div className="space-y-6">
        {/* Webhook Configurations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {language === 'en' ? 'Webhook Configurations' : 'إعدادات ويب هوك'}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Configure webhooks for integration with Make (Integromat), n8n, Zapier, or custom services.'
                : 'قم بتكوين ويب هوك للتكامل مع Make (Integromat) أو n8n أو Zapier أو الخدمات المخصصة.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="make" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="make">Make (Integromat)</TabsTrigger>
                <TabsTrigger value="n8n">n8n</TabsTrigger>
                <TabsTrigger value="zapier">Zapier</TabsTrigger>
                <TabsTrigger value="custom">{language === 'en' ? 'Custom' : 'مخصص'}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="make" className="space-y-4">
                <div>
                  <Label htmlFor="make-webhook">{language === 'en' ? 'Make Webhook URL' : 'رابط ويب هوك Make'}</Label>
                  <div className="flex mt-1">
                    <Input
                      id="make-webhook"
                      value={makeWebhookUrl}
                      onChange={(e) => setMakeWebhookUrl(e.target.value)}
                      placeholder="https://hook.make.com/your-webhook-id"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => testWebhook(makeWebhookUrl)}
                    >
                      {language === 'en' ? 'Test' : 'اختبار'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === 'en'
                      ? 'Create a webhook in Make to receive publication data and share to social media.'
                      : 'قم بإنشاء ويب هوك في Make لاستلام بيانات المنشور والمشاركة على وسائل التواصل الاجتماعي.'}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="n8n" className="space-y-4">
                <div>
                  <Label htmlFor="n8n-webhook">{language === 'en' ? 'n8n Webhook URL' : 'رابط ويب هوك n8n'}</Label>
                  <div className="flex mt-1">
                    <Input
                      id="n8n-webhook"
                      value={n8nWebhookUrl}
                      onChange={(e) => setN8nWebhookUrl(e.target.value)}
                      placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => testWebhook(n8nWebhookUrl)}
                    >
                      {language === 'en' ? 'Test' : 'اختبار'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === 'en'
                      ? 'Configure a webhook node in n8n to process publication data and post to social media.'
                      : 'قم بتكوين عقدة ويب هوك في n8n لمعالجة بيانات المنشور والنشر على وسائل التواصل الاجتماعي.'}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="zapier" className="space-y-4">
                <div>
                  <Label htmlFor="zapier-webhook">{language === 'en' ? 'Zapier Webhook URL' : 'رابط ويب هوك Zapier'}</Label>
                  <div className="flex mt-1">
                    <Input
                      id="zapier-webhook"
                      value={zapierWebhookUrl}
                      onChange={(e) => setZapierWebhookUrl(e.target.value)}
                      placeholder="https://hooks.zapier.com/hooks/catch/your-webhook-id"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => testWebhook(zapierWebhookUrl)}
                    >
                      {language === 'en' ? 'Test' : 'اختبار'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === 'en'
                      ? 'Use a Zapier webhook trigger to receive publication data and create posts on social platforms.'
                      : 'استخدم مشغل ويب هوك Zapier لاستلام بيانات المنشور وإنشاء منشورات على المنصات الاجتماعية.'}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-4">
                <div>
                  <Label htmlFor="custom-webhook">{language === 'en' ? 'Custom Webhook URL' : 'رابط ويب هوك مخصص'}</Label>
                  <div className="flex mt-1">
                    <Input
                      id="custom-webhook"
                      value={customWebhookUrl}
                      onChange={(e) => setCustomWebhookUrl(e.target.value)}
                      placeholder="https://your-custom-webhook-endpoint.com"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => testWebhook(customWebhookUrl)}
                    >
                      {language === 'en' ? 'Test' : 'اختبار'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === 'en'
                      ? 'Provide a custom webhook URL for your own integration solution.'
                      : 'قدم عنوان URL مخصصًا لويب هوك لحل التكامل الخاص بك.'}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveWebhooks}>
              {language === 'en' ? 'Save Configurations' : 'حفظ الإعدادات'}
            </Button>
          </CardFooter>
        </Card>

        {/* Share to Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              {language === 'en' ? 'Share to Social Media' : 'مشاركة على وسائل التواصل الاجتماعي'}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Publish your content to connected social media platforms.'
                : 'انشر المحتوى الخاص بك على منصات التواصل الاجتماعي المتصلة.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="publication-select">
                {language === 'en' ? 'Select Publication' : 'اختر المنشور'}
              </Label>
              <select
                id="publication-select"
                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                value={selectedPublication}
                onChange={(e) => setSelectedPublication(e.target.value)}
              >
                <option value="">
                  {language === 'en' ? '-- Select a publication --' : '-- اختر منشورًا --'}
                </option>
                {publications.map((pub: Publication) => (
                  <option key={pub.id} value={pub.id}>
                    {language === 'en' ? pub.title : pub.titleAr || pub.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>{language === 'en' ? 'Select Platforms' : 'اختر المنصات'}</Label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  type="button" 
                  variant={selectedPlatforms.includes('twitter') ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePlatform('twitter')}
                >
                  Twitter / X
                </Button>
                <Button 
                  type="button" 
                  variant={selectedPlatforms.includes('facebook') ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePlatform('facebook')}
                >
                  Facebook
                </Button>
                <Button 
                  type="button" 
                  variant={selectedPlatforms.includes('linkedin') ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePlatform('linkedin')}
                >
                  LinkedIn
                </Button>
                <Button 
                  type="button" 
                  variant={selectedPlatforms.includes('instagram') ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePlatform('instagram')}
                >
                  Instagram
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handlePublish} disabled={isSending || !selectedPublication || selectedPlatforms.length === 0}>
              {isSending ? (
                <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> {language === 'en' ? 'Sharing...' : 'جارٍ المشاركة...'}</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> {language === 'en' ? 'Share Now' : 'مشاركة الآن'}</>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Import/Export Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpFromLine className="h-5 w-5 mr-2" />
              <ArrowDownToLine className="h-5 w-5" />
              {language === 'en' ? 'Social Import & Export' : 'استيراد وتصدير اجتماعي'}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h3>{language === 'en' ? 'How to Import from Social Media' : 'كيفية الاستيراد من وسائل التواصل الاجتماعي'}</h3>
            <p>
              {language === 'en' 
                ? 'To import content from social media, you need to create a webhook that sends content to your site by making a POST request to:'
                : 'لاستيراد المحتوى من وسائل التواصل الاجتماعي، تحتاج إلى إنشاء ويب هوك يرسل المحتوى إلى موقعك عن طريق إرسال طلب POST إلى:'}
            </p>
            <code className="block p-2 bg-muted rounded-md">
              {window.location.origin}/api/import-from-social
            </code>
            
            <h4>{language === 'en' ? 'Expected Payload Format:' : 'تنسيق البيانات المتوقع:'}</h4>
            <pre className="p-2 bg-muted rounded-md text-xs overflow-auto">
              {`{
  "title": "Publication Title",
  "titleAr": "عنوان المنشور",
  "abstract": "Brief summary of the publication",
  "abstractAr": "ملخص موجز للمنشور",
  "authors": "Author Names",
  "authorsAr": "أسماء المؤلفين",
  "date": "2025-05-12T00:00:00Z",
  "link": "https://original-source.com/article",
  "image": "https://source.com/image.jpg",
  "category": "Category",
  "tags": ["tag1", "tag2"],
  "source": "Twitter" // or other social platform name
}`}
            </pre>
            
            <h3 className="mt-6">{language === 'en' ? 'How to Export to Social Media' : 'كيفية التصدير إلى وسائل التواصل الاجتماعي'}</h3>
            <p>
              {language === 'en'
                ? 'Configure your automation service (Make, n8n, Zapier) to receive webhooks with the following format:'
                : 'قم بتكوين خدمة الأتمتة الخاصة بك (Make أو n8n أو Zapier) لاستلام ويب هوك بالتنسيق التالي:'}
            </p>
            <pre className="p-2 bg-muted rounded-md text-xs overflow-auto">
              {`{
  "title": "Publication Title",
  "titleAr": "عنوان المنشور",
  "abstract": "Brief summary of the publication",
  "abstractAr": "ملخص موجز للمنشور",
  "image": "https://your-site.com/image.jpg",
  "link": "https://your-site.com/publications/123",
  "platforms": ["twitter", "facebook", "linkedin"]
}`}
            </pre>
            
            <p className="mt-4">
              {language === 'en'
                ? 'The Make.com, n8n, and Zapier templates for social sharing can be found in our documentation.'
                : 'يمكن العثور على قوالب Make.com و n8n و Zapier للمشاركة الاجتماعية في وثائقنا.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SocialIntegrations;
