
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, FolderKanban, Users, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface StatsType {
  posts: number;
  projects: number;
  users: number;
  recentActivities: number;
}

export function DatabaseStats() {
  const { language } = useLanguage();
  const [stats, setStats] = useState<StatsType>({
    posts: 0,
    projects: 0,
    users: 0,
    recentActivities: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch posts count
        const { count: postsCount, error: postsError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true });
          
        if (postsError) throw postsError;
        
        // Fetch projects count
        const { count: projectsCount, error: projectsError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
          
        if (projectsError) throw projectsError;
        
        // Fetch users count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        
        // Fetch recent activities (posts or projects created/updated in the last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { count: activitiesCount, error: activitiesError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .gt('created_at', sevenDaysAgo.toISOString());
          
        if (activitiesError) throw activitiesError;
        
        setStats({
          posts: postsCount || 0,
          projects: projectsCount || 0,
          users: usersCount || 0,
          recentActivities: activitiesCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
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
            {loading ? (
              <div className="h-6 w-12 bg-muted animate-pulse rounded" />
            ) : (
              <h3 className="text-2xl font-bold">{stats.posts}</h3>
            )}
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
            {loading ? (
              <div className="h-6 w-12 bg-muted animate-pulse rounded" />
            ) : (
              <h3 className="text-2xl font-bold">{stats.projects}</h3>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center">
          <div className="bg-blue-500/10 p-3 rounded-full">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div className="ms-4">
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Users" : "المستخدمين"}
            </p>
            {loading ? (
              <div className="h-6 w-12 bg-muted animate-pulse rounded" />
            ) : (
              <h3 className="text-2xl font-bold">{stats.users}</h3>
            )}
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
              {language === "en" ? "Recent Activity" : "النشاط الأخير"}
            </p>
            {loading ? (
              <div className="h-6 w-12 bg-muted animate-pulse rounded" />
            ) : (
              <h3 className="text-2xl font-bold">{stats.recentActivities}</h3>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
