
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactForm() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        language === "en"
          ? "Message sent successfully! I'll get back to you soon."
          : "تم إرسال الرسالة بنجاح! سأعود إليك قريبا."
      );
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          {language === "en" ? "Your Name" : "الاسم"}
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={language === "en" ? "John Doe" : "جون دو"}
          required
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          {language === "en" ? "Email Address" : "البريد الإلكتروني"}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={language === "en" ? "john@example.com" : "john@example.com"}
          required
        />
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-1">
          {language === "en" ? "Subject" : "الموضوع"}
        </label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder={language === "en" ? "Project Inquiry" : "استفسار عن مشروع"}
          required
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          {language === "en" ? "Message" : "الرسالة"}
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={
            language === "en"
              ? "Tell me about your project or inquiry..."
              : "أخبرني عن مشروعك أو استفسارك..."
          }
          rows={5}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {language === "en" ? "Sending..." : "جاري الإرسال..."}
          </>
        ) : (
          <>{language === "en" ? "Send Message" : "إرسال الرسالة"}</>
        )}
      </Button>
    </form>
  );
}
