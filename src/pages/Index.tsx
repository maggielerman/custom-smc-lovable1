
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CustomizationOptions from "@/components/CustomizationOptions";
import AboutSection from "@/components/AboutSection";
import SamplePages from "@/components/SamplePages";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import BookPreview from "@/components/BookPreview";
import BookCheckout from "@/components/BookCheckout";
import { BookProvider } from "@/context/BookContext";

const Index = () => {
  return (
    <BookProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <CustomizationOptions />
          <AboutSection />
          <SamplePages />
          <FAQ />
          <BookPreview />
          <BookCheckout />
        </main>
        <Footer />
      </div>
    </BookProvider>
  );
};

export default Index;
