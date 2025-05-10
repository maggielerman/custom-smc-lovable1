
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
            
            <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  Create Your <span className="text-book-red">Custom</span> Book
                </h1>
                <p className="text-gray-600 mb-6">
                  Personalize your book by following the steps below. We'll guide you through creating 
                  a story that perfectly matches your family's journey.
                </p>
                
                <div className="book-preview bg-gradient-to-br from-book-red/20 to-soft-blue/30 rounded-lg p-6 flex justify-center">
                  <div className="relative w-64 max-w-full">
                    <div className="book-cover bg-white rounded-lg shadow-xl aspect-[3/4] transform rotate-3 border-4 border-white">
                      <div className="h-full w-full bg-gradient-to-br from-soft-purple/20 to-calm-yellow/20 rounded p-6 flex items-center justify-center">
                        <div className="text-center">
                          <h2 className="font-bold text-xl text-book-red mb-3">My Special Story</h2>
                          <div className="w-24 h-24 mx-auto bg-soft-blue rounded-full mb-3 flex items-center justify-center">
                            <span className="text-4xl">👨‍👩‍👧</span>
                          </div>
                          <p className="text-sm text-gray-500">A personalized journey just for your family</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-calm-yellow rounded-full flex items-center justify-center shadow-lg">
                      <span className="font-bold text-gray-800 text-xs text-center">100% Personalized</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-book-green text-white flex items-center justify-center font-bold">1</div>
                    <h2 className="text-xl font-bold">Personalize Your Story</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Follow the steps below to create a story that perfectly matches your family's journey and helps explain conception to your child in an age-appropriate way.
                  </p>
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-book-red/20 text-book-red flex items-center justify-center text-xs">✓</div>
                      <span className="text-gray-700">Family Structure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-book-red/20 text-book-red flex items-center justify-center text-xs">✓</div>
                      <span className="text-gray-700">Conception Journey</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-book-red/20 text-book-red flex items-center justify-center text-xs">✓</div>
                      <span className="text-gray-700">Donor Options</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-book-red/20 text-book-red flex items-center justify-center text-xs">✓</div>
                      <span className="text-gray-700">Child's Details</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-book-red/20 text-book-red flex items-center justify-center text-xs">✓</div>
                      <span className="text-gray-700">Age-Appropriate Language</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-book-green hover:bg-green-600 text-white"
                    onClick={() => document.getElementById('customize')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Start Customizing
                  </Button>
                </div>
              </div>
            </div>
            
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
