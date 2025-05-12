
import { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { useLanguage } from "@/context/LanguageContext";
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

const Contact = () => {
  const { language } = useLanguage();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchContactInfo();
  }, []);
  
  // Default values if no contact info is found in database
  const defaultEmail = 'contact@example.com';
  const defaultPhone = '+1 (234) 567-890';
  const defaultAddress = language === 'en' ? 'San Francisco, CA' : 'سان فرانسيسكو، كاليفورنيا';
  const defaultMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d201064.44922610756!2d-122.57768294346552!3d37.7576171678345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sus!4v1653606478928!5m2!1sen!2sus';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 text-center">
                {language === "en" ? "Contact Me" : "تواصل معي"}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    {language === "en" ? "Get in Touch" : "ابقى على تواصل"}
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    {language === "en" 
                      ? "Have a project in mind or want to collaborate? Feel free to reach out using the contact form or through any of the channels below."
                      : "هل لديك مشروع في ذهنك أو ترغب في التعاون؟ لا تتردد في التواصل باستخدام نموذج الاتصال أو من خلال أي من القنوات أدناه."
                    }
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="bg-muted rounded-full p-2 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {language === "en" ? "Email" : "البريد الإلكتروني"}
                        </h3>
                        <a href={`mailto:${loading ? defaultEmail : contactInfo?.email || defaultEmail}`} className="text-muted-foreground hover:text-primary transition-colors">
                          {loading ? defaultEmail : contactInfo?.email || defaultEmail}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="bg-muted rounded-full p-2 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {language === "en" ? "Phone" : "الهاتف"}
                        </h3>
                        <a href={`tel:${loading ? defaultPhone : contactInfo?.phone || defaultPhone}`} className="text-muted-foreground hover:text-primary transition-colors">
                          {loading ? defaultPhone : contactInfo?.phone || defaultPhone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="bg-muted rounded-full p-2 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {language === "en" ? "Location" : "الموقع"}
                        </h3>
                        <p className="text-muted-foreground">
                          {language === "en" 
                            ? (loading ? defaultAddress : contactInfo?.address || defaultAddress)
                            : (loading ? defaultAddress : contactInfo?.addressAr || defaultAddress)
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-medium mb-4">
                      {language === "en" ? "Follow Me" : "تابعني"}
                    </h3>
                    <div className="flex space-x-4 rtl:space-x-reverse">
                      {contactInfo?.socialLinks?.linkedin && (
                        <a href={contactInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="bg-muted hover:bg-primary/20 rounded-full p-2 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect width="4" height="12" x="2" y="9" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                        </a>
                      )}
                      
                      {contactInfo?.socialLinks?.twitter && (
                        <a href={contactInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="bg-muted hover:bg-primary/20 rounded-full p-2 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                          </svg>
                        </a>
                      )}
                      
                      {contactInfo?.socialLinks?.instagram && (
                        <a href={contactInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="bg-muted hover:bg-primary/20 rounded-full p-2 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                          </svg>
                        </a>
                      )}
                      
                      {contactInfo?.socialLinks?.facebook && (
                        <a href={contactInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="bg-muted hover:bg-primary/20 rounded-full p-2 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <ContactForm />
              </div>
              
              <div className="rounded-lg overflow-hidden h-80 shadow-lg">
                <iframe
                  src={loading ? defaultMapUrl : contactInfo?.mapUrl || defaultMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="map"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
