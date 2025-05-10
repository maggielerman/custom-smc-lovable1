
import React from "react";
import { useBookContext } from "@/context/BookContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Define a proper interface for our page objects
interface BookPage {
  title: string;
  content: string;
  color: string;
  emoji?: string; // Make emoji optional
}

const BookPreview: React.FC = () => {
  const { 
    isPreviewOpen, 
    closePreview, 
    conceptionType, 
    familyStructure, 
    childName,
    childAge 
  } = useBookContext();
  const [currentPage, setCurrentPage] = React.useState(0);
  
  // Generate appropriate pages based on the customization options
  const generatePages = (): BookPage[] => {
    const pages: BookPage[] = [
      // Introduction page
      {
        title: `${childName ? childName + "'s" : "Your"} Special Story`,
        content: `This is a story about how ${childName || "you"} came to be part of our wonderful family.`,
        color: "bg-soft-blue",
      },
    ];
    
    // Family structure page
    let familyStructureContent = "";
    let familyEmoji = "👨‍👩‍👧";
    
    switch(familyStructure) {
      case "single-mom":
        familyStructureContent = `${childName || "You"} have a loving mom who wanted a child more than anything in the world.`;
        familyEmoji = "👩‍👧";
        break;
      case "single-dad":
        familyStructureContent = `${childName || "You"} have a loving dad who wanted a child more than anything in the world.`;
        familyEmoji = "👨‍👧";
        break;
      case "two-moms":
        familyStructureContent = `${childName || "You"} have two loving moms who wanted to start a family together.`;
        familyEmoji = "👩‍👩‍👧";
        break;
      case "two-dads":
        familyStructureContent = `${childName || "You"} have two loving dads who wanted to start a family together.`;
        familyEmoji = "👨‍👨‍👧";
        break;
      default:
        familyStructureContent = `${childName || "You"} have a loving mom and dad who wanted to start a family together.`;
    }
    
    pages.push({
      title: "Our Family",
      content: familyStructureContent,
      color: "bg-gentle-pink",
      emoji: familyEmoji
    });
    
    // Conception type page
    let conceptionContent = "";
    let conceptionEmoji = "🔬";
    
    switch(conceptionType) {
      case "iui":
        conceptionContent = "The doctors helped us by placing a tiny seed in mom's body. This special seed helped create you!";
        break;
      case "donor-egg":
        conceptionContent = "A kind woman shared a tiny egg cell to help us make you. This special gift was a crucial part of your beginning.";
        conceptionEmoji = "🥚";
        break;
      case "donor-sperm":
        conceptionContent = "A kind donor shared a tiny seed to help us make you. This special gift was exactly what we needed to start our family.";
        conceptionEmoji = "🌱";
        break;
      case "donor-embryo":
        conceptionContent = "A generous family shared a tiny embryo with us. This special gift grew into you!";
        conceptionEmoji = "✨";
        break;
      default:
        conceptionContent = "The doctors combined a tiny egg and seed in a special lab. Then they carefully placed you in mom's womb to grow.";
    }
    
    pages.push({
      title: "A Special Beginning",
      content: conceptionContent,
      color: "bg-calm-yellow",
      emoji: conceptionEmoji
    });
    
    // Closing page
    pages.push({
      title: "Growing With Love",
      content: `And that's how our family's journey with ${childName || "you"} began. Every family is created differently, but all families are made with love.`,
      color: "bg-soft-purple",
      emoji: "💕"
    });
    
    return pages;
  };
  
  const pages = generatePages();
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  return (
    <Dialog open={isPreviewOpen} onOpenChange={(open) => !open && closePreview()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Book Preview</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="my-4">
          <div className="bg-white rounded-xl p-4 shadow-xl book-shadow mx-auto">
            <div className={cn("aspect-[4/3] flex flex-col items-center justify-center p-8 rounded-lg relative overflow-hidden", pages[currentPage].color)}>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center z-10">
                {pages[currentPage].title}
              </h3>
              
              <div className="book-page bg-white rounded-lg p-6 w-full md:w-4/5 mx-auto z-10 shadow-lg">
                <p className="text-gray-700 text-lg text-center">
                  {pages[currentPage].content}
                </p>
                
                <div className="mt-6 flex justify-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="text-4xl">
                      {pages[currentPage].emoji || "📚"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute bottom-4 right-4 text-6xl">{pages[currentPage].emoji || "📚"}</div>
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
        
        <div className="flex justify-center mt-6">
          <Button className="bg-book-red hover:bg-red-400 text-white">
            Customize More
          </Button>
          <Button className="bg-book-green hover:bg-green-400 text-white ml-4">
            Order This Book
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookPreview;
