
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExperienceManager } from '@/components/dashboard/ExperienceManager';
import { EducationManager } from '@/components/dashboard/EducationManager';
import { ContactInfoEditor } from '@/components/dashboard/ContactInfoEditor';

const ProfileEditor = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('experiences');
  
  return (
    <DashboardLayout 
      title={language === 'en' ? 'Profile Editor' : 'محرر الملف الشخصي'}
      breadcrumbs={[
        {
          label: language === 'en' ? 'Profile Editor' : 'محرر الملف الشخصي',
          href: '/dashboard/profile-editor'
        }
      ]}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="experiences">
            {language === 'en' ? 'Experiences' : 'الخبرات العملية'}
          </TabsTrigger>
          <TabsTrigger value="education">
            {language === 'en' ? 'Education' : 'التعليم'}
          </TabsTrigger>
          <TabsTrigger value="contact">
            {language === 'en' ? 'Contact Info' : 'معلومات الاتصال'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="experiences">
          <ExperienceManager />
        </TabsContent>
        
        <TabsContent value="education">
          <EducationManager />
        </TabsContent>
        
        <TabsContent value="contact">
          <ContactInfoEditor />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ProfileEditor;
