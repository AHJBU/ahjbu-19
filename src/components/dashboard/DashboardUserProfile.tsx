
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Save, User } from 'lucide-react';

interface UserProfile {
  full_name: string;
  username: string;
  website: string;
  avatar_url: string;
}

export function DashboardUserProfile() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    username: '',
    website: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      if (!user?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, username, website, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
          website: data.website || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        full_name: profile.full_name,
        username: profile.username,
        website: profile.website,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;

      toast({
        title: language === 'en' ? 'Profile updated!' : 'تم تحديث الملف الشخصي!',
        description: language === 'en' 
          ? 'Your profile has been updated successfully.' 
          : 'تم تحديث ملفك الشخصي بنجاح.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'An error occurred while updating your profile.' 
          : 'حدث خطأ أثناء تحديث ملفك الشخصي.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const getInitials = () => {
    if (profile.full_name) {
      return profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'en' ? 'Your Profile' : 'ملفك الشخصي'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={updateProfile} className="space-y-6">
          <div className="flex flex-col items-center space-y-4 mb-8">
            <Avatar className="h-24 w-24">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              ) : (
                <AvatarFallback className="text-xl">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="text-center">
              <p className="font-medium text-lg">{profile.full_name || user?.email}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">
                {language === 'en' ? 'Username' : 'اسم المستخدم'}
              </Label>
              <Input
                id="username"
                name="username"
                value={profile.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">
                {language === 'en' ? 'Website' : 'الموقع الإلكتروني'}
              </Label>
              <Input
                id="website"
                name="website"
                value={profile.website}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar_url">
                {language === 'en' ? 'Avatar URL' : 'رابط الصورة الرمزية'}
              </Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={profile.avatar_url}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
          
          <CardFooter className="flex justify-end px-0 pb-0">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                  {language === 'en' ? 'Saving...' : 'جاري الحفظ...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Save Profile' : 'حفظ الملف الشخصي'}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
