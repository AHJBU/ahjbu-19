
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCourse, createOrder } from "@/services/course-service";
import { useAuth } from "@/hooks/useAuth";
import { User, Clock, Book, BarChart, Award, Users, Check, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Fetch course data
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourse(id!),
    enabled: !!id,
  });

  // Mutation for course enrollment
  const enrollMutation = useMutation({
    mutationFn: (data: any) => createOrder(data),
    onSuccess: () => {
      toast({
        title: language === "en" ? "Enrollment Successful" : "تم التسجيل بنجاح",
        description: language === "en" 
          ? "You have successfully enrolled in this course." 
          : "لقد تم تسجيلك بنجاح في هذه الدورة.",
        variant: "default",
      });
      setLoading(false);
    },
    onError: (error: any) => {
      toast({
        title: language === "en" ? "Enrollment Failed" : "فشل التسجيل",
        description: error?.message || (language === "en" ? "An error occurred during enrollment." : "حدث خطأ أثناء التسجيل."),
        variant: "destructive",
      });
      setLoading(false);
    },
  });

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: language === "en" ? "Authentication Required" : "مطلوب المصادقة",
        description: language === "en" 
          ? "Please sign in to enroll in this course." 
          : "يرجى تسجيل الدخول للتسجيل في هذه الدورة.",
        variant: "default",
      });
      return;
    }

    setLoading(true);
    
    enrollMutation.mutate({
      course_id: course?.id,
      user_id: user.id,
      amount: course?.isFree ? 0 : course?.price,
      currency: course?.currency,
      status: course?.isFree ? "completed" : "pending",
      payment_method: course?.isFree ? "free" : "card",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card className="max-w-md mx-auto w-full">
            <CardHeader>
              <CardTitle className="text-red-500">
                <AlertTriangle className="inline mr-2" />
                {language === "en" ? "Course Not Found" : "الدورة غير موجودة"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {language === "en" 
                  ? "The course you are looking for does not exist or may have been removed." 
                  : "الدورة التي تبحث عنها غير موجودة أو ربما تمت إزالتها."
                }
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/courses">
                  {language === "en" ? "Browse Courses" : "تصفح الدورات"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-muted/50 to-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {course.category}
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {language === "en" ? course.title : course.titleAr}
                  </h1>
                </div>
                
                <p className="text-muted-foreground text-lg">
                  {language === "en" ? course.description : course.descriptionAr}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration} {language === "en" ? "hours" : "ساعة"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{course.students} {language === "en" ? "students" : "طالب"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {language === "en" ? course.level : 
                        course.level === "Beginner" ? "مبتدئ" : 
                        course.level === "Intermediate" ? "متوسط" : "متقدم"
                      }
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button 
                    size="lg" 
                    className="px-8" 
                    onClick={handleEnroll}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    ) : (
                      <Check className="h-5 w-5 mr-2" />
                    )}
                    {language === "en" ? "Enroll Now" : "سجل الآن"}
                  </Button>
                  
                  <div className="flex items-center bg-card border rounded-lg px-6 py-3">
                    {course.isFree ? (
                      <span className="text-xl font-bold text-primary">
                        {language === "en" ? "Free" : "مجاني"}
                      </span>
                    ) : (
                      <span className="text-xl font-bold">
                        {new Intl.NumberFormat(language === "en" ? "en-US" : "ar-SA", {
                          style: "currency",
                          currency: course.currency
                        }).format(course.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={course.image || "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?w=800&h=600&fit=crop"} 
                  alt={language === "en" ? course.title : course.titleAr}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Course Details */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="content">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="content">
                      {language === "en" ? "Course Content" : "محتوى الدورة"}
                    </TabsTrigger>
                    <TabsTrigger value="instructor">
                      {language === "en" ? "Instructor" : "المدرب"}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="mt-8 space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-6">
                        {language === "en" ? "Course Overview" : "نظرة عامة على الدورة"}
                      </h3>
                      
                      <div className="prose max-w-none dark:prose-invert">
                        <p className="whitespace-pre-line">
                          {language === "en" ? course.content : course.contentAr}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="instructor" className="mt-8">
                    <div className="flex items-start gap-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          {language === "en" ? "John Doe" : "جون دو"}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {language === "en" 
                            ? "Instructor & Curriculum Developer" 
                            : "مدرب ومطور مناهج"
                          }
                        </p>
                        <p className="mb-4">
                          {language === "en" 
                            ? "John has been teaching for over 10 years and specializes in web development and programming. He has helped thousands of students master complex technical skills."
                            : "يعمل جون في مجال التدريس منذ أكثر من 10 سنوات ويتخصص في تطوير الويب والبرمجة. لقد ساعد الآلاف من الطلاب على إتقان المهارات التقنية المعقدة."
                          }
                        </p>
                        <div className="flex gap-4">
                          <Button variant="outline" size="sm">
                            {language === "en" ? "View Profile" : "عرض الملف الشخصي"}
                          </Button>
                          <Button variant="ghost" size="sm">
                            {language === "en" ? "Contact" : "اتصل"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Reviews Section */}
                <div className="mt-16">
                  <h3 className="text-2xl font-bold mb-8">
                    {language === "en" ? "Student Reviews" : "آراء الطلاب"}
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Review item */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>SD</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">Sarah D.</span>
                              <span className="text-yellow-500 text-xs">★★★★★</span>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">
                              {language === "en" ? "2 weeks ago" : "منذ أسبوعين"}
                            </p>
                            <p>
                              {language === "en" 
                                ? "This course exceeded my expectations! The content is well-structured and the instructor explains complex topics in a simple way."
                                : "تجاوزت هذه الدورة توقعاتي! المحتوى منظم بشكل جيد والمدرب يشرح الموضوعات المعقدة بطريقة بسيطة."
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Review item */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>MJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">Michael J.</span>
                              <span className="text-yellow-500 text-xs">★★★★☆</span>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">
                              {language === "en" ? "1 month ago" : "منذ شهر"}
                            </p>
                            <p>
                              {language === "en" 
                                ? "Great course overall. The content is valuable, though I wish there were more practical exercises to reinforce the concepts."
                                : "دورة رائعة بشكل عام. المحتوى قيم، رغم أنني أتمنى لو كانت هناك المزيد من التمارين العملية لتعزيز المفاهيم."
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>
                      {language === "en" ? "Course Details" : "تفاصيل الدورة"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {language === "en" ? "Duration" : "المدة"}
                        </span>
                        <span className="font-medium">
                          {course.duration} {language === "en" ? "hours" : "ساعة"}
                        </span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {language === "en" ? "Level" : "المستوى"}
                        </span>
                        <span className="font-medium">
                          {language === "en" ? course.level : 
                            course.level === "Beginner" ? "مبتدئ" : 
                            course.level === "Intermediate" ? "متوسط" : "متقدم"
                          }
                        </span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {language === "en" ? "Students" : "الطلاب"}
                        </span>
                        <span className="font-medium">{course.students}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {language === "en" ? "Language" : "اللغة"}
                        </span>
                        <span className="font-medium">
                          {language === "en" ? "English, Arabic" : "الإنجليزية، العربية"}
                        </span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {language === "en" ? "Last Updated" : "آخر تحديث"}
                        </span>
                        <span className="font-medium">
                          {course.updated_at ? new Date(course.updated_at).toLocaleDateString(
                            language === "en" ? "en-US" : "ar-SA"
                          ) : ""}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg mt-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        {language === "en" ? "What You'll Learn" : "ماذا ستتعلم"}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                          <span>
                            {language === "en" 
                              ? "Master fundamental concepts" 
                              : "إتقان المفاهيم الأساسية"
                            }
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                          <span>
                            {language === "en" 
                              ? "Apply skills to real-world projects" 
                              : "تطبيق المهارات على مشاريع واقعية"
                            }
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                          <span>
                            {language === "en" 
                              ? "Build a professional portfolio" 
                              : "بناء محفظة مهنية"
                            }
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full mt-6" 
                      onClick={handleEnroll}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      ) : course.isFree ? (
                        <span>{language === "en" ? "Enroll For Free" : "سجل مجاناً"}</span>
                      ) : (
                        <span>
                          {language === "en" ? "Enroll Now for " : "سجل الآن مقابل "}
                          {new Intl.NumberFormat(language === "en" ? "en-US" : "ar-SA", {
                            style: "currency",
                            currency: course.currency
                          }).format(course.price)}
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Courses */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10">
              {language === "en" ? "Related Courses" : "دورات ذات صلة"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Placeholder for related courses */}
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-155802121${i}694-51b6ecfa0db9?w=800&h=600&fit=crop`} 
                      alt="Course thumbnail" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="outline" className="bg-white/90">Popular</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>
                      {language === "en" ? `Related Course ${i}` : `دورة ذات صلة ${i}`}
                    </CardTitle>
                    <CardDescription>
                      {language === "en" 
                        ? "Learn essential skills and concepts" 
                        : "تعلم المهارات والمفاهيم الأساسية"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        {language === "en" ? `${6 + i} hours` : `${6 + i} ساعات`}
                      </span>
                      <span className="font-bold">
                        {new Intl.NumberFormat(language === "en" ? "en-US" : "ar-SA", {
                          style: "currency",
                          currency: "USD"
                        }).format(49.99 + (i * 10))}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/courses/related-${i}`}>
                        {language === "en" ? "View Details" : "عرض التفاصيل"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
