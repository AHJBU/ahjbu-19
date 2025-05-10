
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Briefcase, Award, Book, FileText } from "lucide-react";

export function About() {
  const { language, t } = useLanguage();

  const skills = [
    "React", "TypeScript", "Node.js", "Next.js",
    "GraphQL", "Tailwind CSS", "UI/UX Design", "MongoDB"
  ];

  const experiences = [
    {
      period: language === "en" ? "2021 - Present" : "٢٠٢١ - الحاضر",
      title: language === "en" ? "Senior Full-Stack Developer" : "مطور الويب الشامل",
      company: language === "en" ? "Tech Innovations Ltd" : "شركة تك إنوفيشنز",
      description: language === "en" 
        ? "Lead developer for enterprise web applications using React, Node.js, and GraphQL. Managed a team of 5 developers."
        : "مطور رئيسي لتطبيقات الويب للشركات باستخدام React و Node.js و GraphQL. إدارة فريق من 5 مطورين."
    },
    {
      period: language === "en" ? "2018 - 2021" : "٢٠١٨ - ٢٠٢١",
      title: language === "en" ? "Frontend Developer" : "مطور واجهة المستخدم",
      company: language === "en" ? "Digital Solutions" : "الحلول الرقمية",
      description: language === "en"
        ? "Developed responsive web applications with React and Redux. Implemented UI/UX designs and optimized performance."
        : "تطوير تطبيقات الويب سريعة الاستجابة باستخدام React و Redux. تنفيذ تصميمات واجهة المستخدم وتحسين الأداء."
    },
    {
      period: language === "en" ? "2016 - 2018" : "٢٠١٦ - ٢٠١٨",
      title: language === "en" ? "Web Developer" : "مطور ويب",
      company: language === "en" ? "Creative Studios" : "استديوهات إبداعية",
      description: language === "en"
        ? "Built websites using HTML, CSS, and JavaScript. Collaborated with designers to create responsive layouts."
        : "بناء مواقع الويب باستخدام HTML و CSS و JavaScript. التعاون مع المصممين لإنشاء تخطيطات متجاوبة."
    }
  ];

  const education = [
    {
      period: language === "en" ? "2012 - 2016" : "٢٠١٢ - ٢٠١٦",
      degree: language === "en" ? "Bachelor of Computer Science" : "بكالوريوس علوم الحاسب",
      institution: language === "en" ? "University of Technology" : "جامعة التكنولوجيا",
      description: language === "en"
        ? "Graduated with honors. Specialized in software development and web technologies."
        : "تخرج بمرتبة الشرف. متخصص في تطوير البرمجيات وتقنيات الويب."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("aboutMe")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className={`${language === "ar" ? "order-1" : ""}`}>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden border-4 border-background shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1603575449096-da705f622102"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-turquoise-500/20 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h3 className="text-2xl font-medium">
              {language === "en" 
                ? "Hi, I'm John Doe" 
                : "مرحباً، أنا جون دو"
              }
            </h3>
            
            <p className="text-muted-foreground">
              {language === "en"
                ? "I'm a full-stack developer with over 5 years of experience in building modern web applications. I specialize in React, Node.js, and serverless architectures."
                : "أنا مطور full-stack مع أكثر من 5 سنوات من الخبرة في بناء تطبيقات الويب الحديثة. أتخصص في React و Node.js والبنى الـ serverless."
              }
            </p>
            
            <p className="text-muted-foreground">
              {language === "en"
                ? "I'm passionate about creating intuitive user interfaces and scalable backend systems that solve real-world problems."
                : "أنا شغوف بإنشاء واجهات مستخدم بديهية وأنظمة خلفية قابلة للتوسع تحل المشكلات الحقيقية."
              }
            </p>

            <div>
              <h4 className="font-medium mb-3">{t("skills")}</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 rounded-full bg-muted text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="h-5 w-5 text-purple-500" />
            <h3 className="text-2xl font-bold">
              {language === "en" ? "Professional Experience" : "الخبرة المهنية"}
            </h3>
          </div>

          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h4 className="font-bold text-lg">{exp.title}</h4>
                    <span className="text-sm text-muted-foreground">{exp.period}</span>
                  </div>
                  <div className="text-muted-foreground mb-2">{exp.company}</div>
                  <p className="text-sm">{exp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Book className="h-5 w-5 text-purple-500" />
            <h3 className="text-2xl font-bold">
              {language === "en" ? "Education" : "التعليم"}
            </h3>
          </div>

          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h4 className="font-bold text-lg">{edu.degree}</h4>
                    <span className="text-sm text-muted-foreground">{edu.period}</span>
                  </div>
                  <div className="text-muted-foreground mb-2">{edu.institution}</div>
                  <p className="text-sm">{edu.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Downloads Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-5 w-5 text-purple-500" />
            <h3 className="text-2xl font-bold">
              {language === "en" ? "Downloads" : "التحميلات"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="overflow-hidden border-none shadow-md">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-2">
                  {language === "en" ? "Download Resume" : "تحميل السيرة الذاتية"}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "en" 
                    ? "Download my complete resume in PDF format"
                    : "تحميل سيرتي الذاتية الكاملة بصيغة PDF"
                  }
                </p>
                <Button size="sm">
                  {language === "en" ? "Download PDF" : "تحميل PDF"}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-none shadow-md">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-2">
                  {language === "en" ? "Portfolio Projects" : "مشاريع المعرض"}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "en" 
                    ? "View my complete portfolio with detailed case studies"
                    : "عرض معرض أعمالي الكامل مع دراسات حالة مفصلة"
                  }
                </p>
                <Button size="sm" asChild>
                  <Link to="/projects">
                    {language === "en" ? "View Projects" : "عرض المشاريع"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="px-8">
            <Link to="/contact">
              {language === "en" ? "Contact Me" : "تواصل معي"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
