
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { RecentPosts } from "@/components/home/RecentPosts";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <Hero />
        <About />
        <FeaturedProjects />
        <RecentPosts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
