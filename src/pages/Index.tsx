
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BookCustomizer from "@/components/BookCustomizer";
import AboutSection from "@/components/AboutSection";
import SamplePages from "@/components/SamplePages";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <BookCustomizer />
        <AboutSection />
        <SamplePages />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
