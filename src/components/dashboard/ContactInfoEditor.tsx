
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ContactInfo {
  id?: string;
  email: string;
  phone: string;
  address: string;
  addressAr: string;
  mapUrl: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

export function ContactInfoEditor() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    address: '',
    addressAr: '',
    mapUrl: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    }
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to load contact info' : 'فشل في تحميل معلومات الاتصال',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social.')) {
      const socialName = name.split('.')[1];
      setContactInfo(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialName]: value
        }
      }));
    } else {
      setContactInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (contactInfo.id) {
        // Update existing record
        const { error } = await supabase
          .from('contact_info')
          .update(contactInfo)
          .eq('id', contactInfo.id);
          
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('contact_info')
          .insert([contactInfo]);
          
        if (error) throw error;
      }
      
      toast({
        title: language === 'en' ? 'Success' : 'تم بنجاح',
        description: language === 'en' ? 'Contact information updated successfully' : 'تم تحديث معلومات الاتصال بنجاح'
      });
      
      // Refresh data
      fetchContactInfo();
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to save contact info' : 'فشل في حفظ معلومات الاتصال',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'en' ? 'Contact Information' : 'معلومات الاتصال'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={contactInfo.email}
                onChange={handleInputChange}
                placeholder={language === 'en' ? 'contact@example.com' : 'contact@example.com'}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
              </Label>
              <Input
                id="phone"
                name="phone"
                value={contactInfo.phone}
                onChange={handleInputChange}
                placeholder={language === 'en' ? '+123 456 7890' : '+123 456 7890'}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {language === 'en' ? 'Address (English)' : 'العنوان (بالإنجليزية)'}
              </Label>
              <Textarea
                id="address"
                name="address"
                value={contactInfo.address}
                onChange={handleInputChange}
                placeholder={language === 'en' ? 'Your address' : 'عنوانك'}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="addressAr" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {language === 'en' ? 'Address (Arabic)' : 'العنوان (بالعربية)'}
              </Label>
              <Textarea
                id="addressAr"
                name="addressAr"
                value={contactInfo.addressAr}
                onChange={handleInputChange}
                placeholder={language === 'en' ? 'Your Arabic address' : 'عنوانك بالعربية'}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mapUrl">
                {language === 'en' ? 'Google Maps Embed URL' : 'رابط تضمين خرائط جوجل'}
              </Label>
              <Input
                id="mapUrl"
                name="mapUrl"
                value={contactInfo.mapUrl}
                onChange={handleInputChange}
                placeholder={language === 'en' ? 'https://www.google.com/maps/embed?...' : 'https://www.google.com/maps/embed?...'}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'en'
                  ? 'Paste the embed URL from Google Maps (not the full iframe tag)'
                  : 'الصق رابط التضمين من خرائط جوجل (وليس وسم iframe الكامل)'}
              </p>
            </div>
            
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-medium mb-4">
                {language === 'en' ? 'Social Media Links' : 'روابط وسائل التواصل الاجتماعي'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="social.linkedin"
                    value={contactInfo.socialLinks.linkedin || ''}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="social.twitter"
                    value={contactInfo.socialLinks.twitter || ''}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="social.facebook"
                    value={contactInfo.socialLinks.facebook || ''}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="social.instagram"
                    value={contactInfo.socialLinks.instagram || ''}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" disabled={saving}>
              {saving
                ? (language === 'en' ? 'Saving...' : 'جاري الحفظ...')
                : (language === 'en' ? 'Save Changes' : 'حفظ التغييرات')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
