
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, FolderKanban, Users, Eye, Plus, Clock } from "lucide-react";

// Dummy data - would be replaced with actual data from backend
const stats = {
  posts: 24,
  projects: 12,
  views: 15243,
  drafts: 5,
};

const recentPosts = [
  { id: "post1", title: "Getting Started with React", date: "2023-10-15" },
  { id: "post2", title: "Advanced TypeScript Patterns", date: "2023-10-10" },
  { id: "post3", title: "CSS Grid Mastery", date: "2023-10-05" },
];

const Dashboard = () => {
  const { language } = useLanguage();

  return (
    <DashboardLayout title={language === "en" ? "Dashboard" : "لوحة التحكم"}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="ms-4">
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Blog Posts" : "منشورات المدونة"}
              </p>
              <h3 className="text-2xl font-bold">{stats.posts}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-orange-500/10 p-3 rounded-full">
              <FolderKanban className="h-6 w-6 text-orange-500" />
            </div>
            <div className="ms-4">
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Projects" : "المشاريع"}
              </p>
              <h3 className="text-2xl font-bold">{stats.projects}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-blue-500/10 p-3 rounded-full">
              <Eye className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ms-4">
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Total Views" : "إجمالي المشاهدات"}
              </p>
              <h3 className="text-2xl font-bold">{stats.views.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-purple-500/10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ms-4">
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Drafts" : "المسودات"}
              </p>
              <h3 className="text-2xl font-bold">{stats.drafts}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {language === "en" ? "Quick Actions" : "إجراءات سريعة"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/dashboard/blog/editor">
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "New Blog Post" : "منشور مدونة جديد"}
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link to="/dashboard/projects">
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "New Project" : "مشروع جديد"}
            </Link>
          </Button>
          
          <Button asChild variant="secondary">
            <Link to="/dashboard/settings">
              {language === "en" ? "Site Settings" : "إعدادات الموقع"}
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "en" ? "Recent Posts" : "آخر المنشورات"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.date).toLocaleDateString(
                        language === "en" ? "en-US" : "ar-SA",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/blog/${post.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      {language === "en" ? "View" : "عرض"}
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/dashboard/blog/editor/${post.id}`}>
                      {language === "en" ? "Edit" : "تعديل"}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
