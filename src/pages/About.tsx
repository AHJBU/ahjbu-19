
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { About as AboutSection } from "@/components/home/About";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
