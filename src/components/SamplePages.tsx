
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SamplePages: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    {
      title: "A Special Way to Make a Family",
      content: "Some families are made in different special ways. Your story is unique and filled with so much love.",
      color: "bg-soft-blue",
    },
    {
      title: "What is a Donor?",
      content: "A donor is a kind person who shared a tiny cell to help us make you. They gave us a special gift.",
      color: "bg-gentle-pink",
    },
    {
      title: "Growing in Love",
      content: "We wanted you so much that we asked doctors to help us. We were so happy when we found out you were growing!",
      color: "bg-calm-yellow",
    },
    {
      title: "The Day You Arrived",
      content: "The day you were born was the happiest day of our lives. We had waited so long to meet you!",
      color: "bg-soft-purple",
    },
  ];
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  return (
    <section id="sample" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Sample <span className="text-book-red">Book</span> Pages
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Preview some of the pages from our customizable books. Each story is tailored to your
            family's unique journey.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-white rounded-xl p-4 shadow-xl book-shadow mx-auto max-w-2xl">
            <div className="aspect-[4/3] flex flex-col items-center justify-center p-8 rounded-lg relative overflow-hidden" 
                style={{ backgroundColor: pages[currentPage].color }}>
              
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center z-10">
                {pages[currentPage].title}
              </h3>
              
              <div className="book-page bg-white rounded-lg p-6 w-4/5 mx-auto z-10 shadow-lg">
                <p className="text-gray-700 text-lg text-center">
                  {pages[currentPage].content}
                </p>
                
                <div className="mt-6 flex justify-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="text-4xl">
                      {currentPage === 0 && "👨‍👩‍👧"}
                      {currentPage === 1 && "🌟"}
                      {currentPage === 2 && "🏥"}
                      {currentPage === 3 && "👶"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                {currentPage === 0 && (
                  <div className="absolute top-4 right-4 text-6xl">💕</div>
                )}
                {currentPage === 1 && (
                  <div className="absolute bottom-4 left-4 text-6xl">🎁</div>
                )}
                {currentPage === 2 && (
                  <div className="absolute top-4 left-4 text-6xl">🔬</div>
                )}
                {currentPage === 3 && (
                  <div className="absolute bottom-4 right-4 text-6xl">🎉</div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 px-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={prevPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex space-x-2">
                {pages.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      currentPage === index ? "bg-book-red" : "bg-gray-300"
                    )}
                    onClick={() => setCurrentPage(index)}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={nextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Each book includes 20-30 pages of customized content with beautiful illustrations
          </p>
          <Button 
            className="bg-book-red hover:bg-red-400 text-white rounded-full"
          >
            See More Examples
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SamplePages;
