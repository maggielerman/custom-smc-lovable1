
import { useNavigate } from "react-router-dom";
import { BookProvider } from "@/context/BookContext";
import BookCustomizer from "@/components/BookCustomizer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookPreview from "@/components/BookPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CreateBook = () => {
  const navigate = useNavigate();
  
  return (
    <BookProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <Button 
              variant="ghost" 
              className="mb-4 flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Create Your <span className="text-book-red">Custom</span> Book
            </h1>
            <BookCustomizer />
          </div>
        </main>
        <BookPreview />
        <Footer />
      </div>
    </BookProvider>
  );
};

export default CreateBook;
