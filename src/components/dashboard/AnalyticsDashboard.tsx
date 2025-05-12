
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { CalendarIcon, GlobeIcon, MousePointerIcon, UserIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for visitor analytics
const visitorData = [
  { name: 'Jan', visitors: 89, pageViews: 120 },
  { name: 'Feb', visitors: 103, pageViews: 140 },
  { name: 'Mar', visitors: 118, pageViews: 170 },
  { name: 'Apr', visitors: 142, pageViews: 190 },
  { name: 'May', visitors: 129, pageViews: 180 },
  { name: 'Jun', visitors: 156, pageViews: 210 },
  { name: 'Jul', visitors: 172, pageViews: 220 }
];

const trafficSourceData = [
  { name: 'Direct', value: 40 },
  { name: 'Search', value: 30 },
  { name: 'Social', value: 20 },
  { name: 'Referral', value: 10 }
];

const deviceData = [
  { name: 'Desktop', value: 65 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 5 }
];

const countryData = [
  { name: 'Saudi Arabia', value: 45 },
  { name: 'UAE', value: 20 },
  { name: 'Egypt', value: 15 },
  { name: 'USA', value: 10 },
  { name: 'Other', value: 10 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function AnalyticsDashboard() {
  const { language } = useLanguage();
  const [timeRange, setTimeRange] = useState('week');
  
  const formatTooltip = (value: number, name: string) => {
    if (name === 'pageViews') return [`${value}`, language === 'en' ? 'Page Views' : 'مشاهدات الصفحة'];
    if (name === 'visitors') return [`${value}`, language === 'en' ? 'Visitors' : 'الزوار'];
    return [`${value}`, name];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h3 className="text-lg font-medium">
            {language === 'en' ? 'Website Traffic Analytics' : 'تحليلات حركة الموقع'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? 'Overview of visitor activity and engagement metrics' : 'نظرة عامة على نشاط الزوار ومقاييس المشاركة'}
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={language === 'en' ? 'Time Range' : 'النطاق الزمني'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">{language === 'en' ? 'Last 24 Hours' : 'آخر 24 ساعة'}</SelectItem>
            <SelectItem value="week">{language === 'en' ? 'Last 7 Days' : 'آخر 7 أيام'}</SelectItem>
            <SelectItem value="month">{language === 'en' ? 'Last 30 Days' : 'آخر 30 يوماً'}</SelectItem>
            <SelectItem value="year">{language === 'en' ? 'Last 12 Months' : 'آخر 12 شهراً'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'Total Visitors' : 'إجمالي الزوار'}
                </p>
                <p className="text-2xl font-bold">1,248</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+12%</span> {language === 'en' ? 'from last period' : 'من الفترة السابقة'}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <UserIcon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'Page Views' : 'مشاهدات الصفحة'}
                </p>
                <p className="text-2xl font-bold">3,856</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+8%</span> {language === 'en' ? 'from last period' : 'من الفترة السابقة'}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <MousePointerIcon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'Avg. Session Duration' : 'متوسط مدة الجلسة'}
                </p>
                <p className="text-2xl font-bold">3:24</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500">-2%</span> {language === 'en' ? 'from last period' : 'من الفترة السابقة'}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <CalendarIcon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'Bounce Rate' : 'معدل الارتداد'}
                </p>
                <p className="text-2xl font-bold">42%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">-4%</span> {language === 'en' ? 'from last period' : 'من الفترة السابقة'}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <GlobeIcon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === 'en' ? 'Traffic Overview' : 'نظرة عامة على الحركة'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Visitors and page views over time' : 'الزوار ومشاهدات الصفحة عبر الوقت'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitorData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip formatter={formatTooltip} />
                  <Legend align="right" verticalAlign="top" height={36} />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    name={language === 'en' ? 'Visitors' : 'الزوار'} 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pageViews" 
                    name={language === 'en' ? 'Page Views' : 'مشاهدات الصفحة'} 
                    stroke="#82ca9d" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === 'en' ? 'Traffic Sources' : 'مصادر الحركة'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Where your visitors are coming from' : 'من أين يأتي زوارك'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {trafficSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === 'en' ? 'Device Breakdown' : 'تقسيم الأجهزة'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Devices used to access your site' : 'الأجهزة المستخدمة للوصول إلى موقعك'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === 'en' ? 'Top Countries' : 'أهم الدول'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Visitor location by country' : 'موقع الزائر حسب الدولة'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData} layout="vertical">
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tickLine={false} 
                    axisLine={false} 
                    width={80}
                  />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                    {countryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
