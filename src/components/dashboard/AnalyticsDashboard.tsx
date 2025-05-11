
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getCoursesAnalytics } from "@/services/mysql-course-service";
import { getMediaAnalytics } from "@/services/mysql-media-service";
import { useLanguage } from "@/context/LanguageContext";
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BookOpen, Download, Image, Users, FileText } from "lucide-react";

export function AnalyticsDashboard() {
  const { language } = useLanguage();
  
  const { data: courseAnalytics = {
    totalCourses: 0,
    freeCourses: 0,
    paidCourses: 0,
    featuredCourses: 0,
    totalOrders: 0,
    totalStudents: 0,
  }, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courseAnalytics'],
    queryFn: () => getCoursesAnalytics(),
  });

  const { data: mediaAnalytics = {
    totalMedia: 0,
    totalSize: 0,
    byType: {}
  }, isLoading: isLoadingMedia } = useQuery({
    queryKey: ['mediaAnalytics'],
    queryFn: () => getMediaAnalytics(),
  });
  
  // Format bytes to human-readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Prepare chart data
  const courseTypesData = [
    { name: language === "en" ? 'Free' : 'مجاني', value: courseAnalytics.freeCourses },
    { name: language === "en" ? 'Paid' : 'مدفوع', value: courseAnalytics.paidCourses },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Format media type data
  const mediaTypesArray = Object.entries(mediaAnalytics.byType || {}).map(([type, count], index) => ({
    name: type.split('/')[1] || type,
    value: count,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            {language === "en" ? "Overview" : "نظرة عامة"}
          </TabsTrigger>
          <TabsTrigger value="courses">
            {language === "en" ? "Courses" : "الدورات"}
          </TabsTrigger>
          <TabsTrigger value="media">
            {language === "en" ? "Media & Files" : "الوسائط والملفات"}
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === "en" ? "Total Courses" : "إجمالي الدورات"}
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courseAnalytics.totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  {courseAnalytics.featuredCourses} {language === "en" ? "featured" : "مميزة"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === "en" ? "Total Students" : "إجمالي الطلاب"}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courseAnalytics.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  {courseAnalytics.totalOrders} {language === "en" ? "orders" : "طلبات"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === "en" ? "Total Media" : "إجمالي الوسائط"}
                </CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mediaAnalytics.totalMedia}</div>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(mediaAnalytics.totalSize)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === "en" ? "Downloads" : "التنزيلات"}
                </CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "Coming soon" : "قريبًا"}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Course Types" : "أنواع الدورات"}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={courseTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {courseTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Media Types" : "أنواع الوسائط"}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mediaTypesArray}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value">
                        {mediaTypesArray.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Course Analytics" : "تحليلات الدورات"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Total Courses" : "إجمالي الدورات"}
                  </div>
                  <div className="text-3xl font-bold">{courseAnalytics.totalCourses}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Free Courses" : "دورات مجانية"}
                  </div>
                  <div className="text-3xl font-bold">{courseAnalytics.freeCourses}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Paid Courses" : "دورات مدفوعة"}
                  </div>
                  <div className="text-3xl font-bold">{courseAnalytics.paidCourses}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Featured Courses" : "دورات مميزة"}
                  </div>
                  <div className="text-3xl font-bold">{courseAnalytics.featuredCourses}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Total Orders" : "إجمالي الطلبات"}
                  </div>
                  <div className="text-3xl font-bold">{courseAnalytics.totalOrders}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Total Students" : "إجمالي الطلاب"}
                  </div>
                  <div className="text-3xl font-bold">{courseAnalytics.totalStudents}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Media Analytics" : "تحليلات الوسائط"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Total Media Items" : "إجمالي عناصر الوسائط"}
                  </div>
                  <div className="text-3xl font-bold">{mediaAnalytics.totalMedia}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Total Storage Used" : "إجمالي المساحة المستخدمة"}
                  </div>
                  <div className="text-3xl font-bold">{formatBytes(mediaAnalytics.totalSize)}</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">
                  {language === "en" ? "Media Types Breakdown" : "تفصيل أنواع الوسائط"}
                </h4>
                <div className="space-y-2">
                  {Object.entries(mediaAnalytics.byType || {}).map(([type, count], index) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="text-sm">{type}</div>
                      <div className="font-medium">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
