
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCourse, createOrder } from "@/services/course-service";
import { toast } from "@/components/ui/use-toast";
import { 
  Clock, 
  Users, 
  BookOpen,
  FileText,
  Share2,
  ShoppingCart,
  CheckCircle2
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    name: "",
    email: ""
  });
  
  // Fetch course data
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => id ? getCourse(id) : Promise.reject(new Error("No course ID provided")),
    enabled: !!id
  });

  // Create order mutation
  const orderMutation = useMutation({
    mutationFn: (data: { courseId: string; name: string; email: string; price: number }) => {
      return createOrder({
        courseId: data.courseId,
        name: data.name,
        email: data.email,
        price: data.price,
        status: 'pending'
      });
    },
    onSuccess: () => {
      toast({
        title: language === "en" ? "Order submitted successfully" : "تم تقديم الطلب بنجاح",
        description: language === "en" 
          ? "We will contact you soon with more details." 
          : "سنتواصل معك قريبًا بمزيد من التفاصيل.",
        variant: "default",
      });
      setIsOrderOpen(false);
      setOrderData({ name: "", email: "" });
    },
    onError: (error) => {
      toast({
        title: language === "en" ? "Error submitting order" : "خطأ في تقديم الطلب",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!course) return;
    
    orderMutation.mutate({
      courseId: course.id,
      name: orderData.name,
      email: orderData.email,
      price: course.isFree ? 0 : course.price
    });
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: language === "en" ? "Link Copied" : "تم نسخ الرابط",
      description: language === "en" ? "Course link copied to clipboard" : "تم نسخ رابط الدورة إلى الحافظة",
      variant: "default",
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="flex justify-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">
              {language === "en" ? "Course not found" : "الدورة غير موجودة"}
            </h1>
            <p className="mb-6">
              {language === "en" 
                ? "The course you're looking for doesn't exist or has been removed."
                : "الدورة التي تبحث عنها غير موجودة أو تمت إزالتها."
              }
            </p>
            <Button asChild>
              <Link to="/courses">
                {language === "en" ? "Browse Courses" : "تصفح الدورات"}
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Course image */}
              <div className="md:w-1/2">
                <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={course.image || "/placeholder.svg"} 
                    alt={language === "en" ? course.title : course.titleAr}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Course details */}
              <div className="md:w-1/2">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">
                    {course.category}
                  </Badge>
                  <Badge variant={course.level === "Beginner" ? "secondary" : "default"}>
                    {course.level === "Beginner" 
                      ? language === "en" ? "Beginner" : "مبتدئ"
                      : course.level === "Intermediate" 
                        ? language === "en" ? "Intermediate" : "متوسط"
                        : language === "en" ? "Advanced" : "متقدم"
                    }
                  </Badge>
                  {course.featured && (
                    <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                      {language === "en" ? "Featured" : "مميز"}
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold mb-2">
                  {language === "en" ? course.title : course.titleAr}
                </h1>
                
                <p className="text-muted-foreground mb-4">
                  {language === "en" ? course.description : course.descriptionAr}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration} {language === "en" ? "hours" : "ساعات"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{course.lessons} {language === "en" ? "lessons" : "درس"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{course.students}+ {language === "en" ? "students" : "طالب"}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-xl font-bold">
                    {course.isFree 
                      ? language === "en" ? "Free" : "مجاني"
                      : `${course.price} ${course.currency}`
                    }
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="flex-1 md:flex-none"
                    onClick={() => setIsOrderOpen(true)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {language === "en" ? "Enroll Now" : "سجل الآن"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="flex-1 md:flex-none"
                    onClick={handleCopyLink}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {language === "en" ? "Share" : "مشاركة"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Course content section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs 
              defaultValue="overview" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">
                  {language === "en" ? "Overview" : "نظرة عامة"}
                </TabsTrigger>
                <TabsTrigger value="content">
                  {language === "en" ? "Content" : "المحتوى"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-8">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ 
                    __html: language === "en" ? course.content : course.contentAr 
                  }} />
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-6">
                <h3 className="text-xl font-bold mb-4">
                  {language === "en" ? "Course Content" : "محتوى الدورة"}
                </h3>
                
                <div className="space-y-4">
                  {Array.from({ length: course.lessons || 3 }).map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">
                                {language === "en" 
                                  ? `Lesson ${index + 1}: Sample lesson title` 
                                  : `الدرس ${index + 1}: عنوان درس نموذجي`
                                }
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {Math.ceil(Math.random() * 60)} {language === "en" ? "minutes" : "دقيقة"}
                              </p>
                            </div>
                          </div>
                          
                          {index === 0 ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              {language === "en" ? "Free Preview" : "معاينة مجانية"}
                            </Badge>
                          ) : (
                            <Button variant="ghost" size="sm" disabled>
                              {language === "en" ? "Locked" : "مقفل"}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Order form modal */}
        {isOrderOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">
                    {language === "en" ? "Enroll in Course" : "التسجيل في الدورة"}
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsOrderOpen(false)}>
                    &times;
                  </Button>
                </div>
                
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === "en" ? "Your Name" : "الاسم"}
                    </label>
                    <input
                      type="text"
                      required
                      value={orderData.name}
                      onChange={e => setOrderData({...orderData, name: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === "en" ? "Email Address" : "البريد الإلكتروني"}
                    </label>
                    <input
                      type="email"
                      required
                      value={orderData.email}
                      onChange={e => setOrderData({...orderData, email: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-bold mb-4">
                      <span>{language === "en" ? "Total Price:" : "السعر الإجمالي:"}</span>
                      <span>
                        {course.isFree 
                          ? language === "en" ? "Free" : "مجاني" 
                          : `${course.price} ${course.currency}`
                        }
                      </span>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={orderMutation.isPending}
                    >
                      {orderMutation.isPending ? (
                        <span className="flex items-center">
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                          {language === "en" ? "Processing..." : "جاري المعالجة..."}
                        </span>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {language === "en" ? "Confirm Enrollment" : "تأكيد التسجيل"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
