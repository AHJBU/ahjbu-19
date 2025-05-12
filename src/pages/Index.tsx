
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { RecentPosts } from "@/components/home/RecentPosts";
import { useHomePageContent } from "@/services/static-content-service";

const Index = () => {
  const { homePageContent } = useHomePageContent();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95 dark:from-background dark:to-background/90">
      <Header />
      <main className="flex-grow pt-16">
        <Hero />
        <FeaturedProjects />
        <RecentPosts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
