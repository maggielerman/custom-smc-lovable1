
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
import { Helmet } from "react-helmet";
import ProductSchema from "@/components/seo/ProductSchema";

const HomePage = () => {
  // Default price in cents (29.99)
  const bookPrice = 2999;
  const bookTitle = "Custom Children's Book";
  
  return (
    <>
      <Helmet>
        <title>Little Origins Books | Personalized Children's Books for Donor Conception</title>
        <meta name="description" content="Customizable children's books explaining donor conception with love and care. Help your child understand their unique origin story." />
      </Helmet>
      <script type="application/ld+json">
        {`
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Little Origins Books",
          "url": "https://littleoriginsbooks.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://littleoriginsbooks.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
        `}
      </script>
      <ProductSchema 
        bookTitle={bookTitle}
        price={bookPrice}
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <CustomizationOptions />
          <AboutSection />
          <SamplePages />
          <FAQ />
          <BookPreview />
          <BookCheckout 
            bookTitle={bookTitle}
            bookPrice={bookPrice / 100} // Convert cents to dollars
            coverImage="/placeholder.svg"
          />
        </main>
        <Footer />
      </div>
    </>
  );
};

const Index = () => {
  return (
    <BookProvider>
      <HomePage />
    </BookProvider>
  );
};

export default Index;
