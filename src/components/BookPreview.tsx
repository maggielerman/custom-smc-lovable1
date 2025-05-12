
import React from "react";
import { useBookContext } from "@/context/BookContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import BookPageContent from "./book/BookPageContent";
import BookPagination from "./book/BookPagination";
import BookActionButtons from "./book/BookActionButtons";
import { generatePages } from "@/utils/bookPageGenerator";

const BookPreview: React.FC = () => {
  const { 
    isPreviewOpen, 
    closePreview, 
    conceptionType, 
    familyStructure, 
    childName,
    childAge,
    openCheckout,
    addToCart
  } = useBookContext();
  
  const [currentPage, setCurrentPage] = React.useState(0);
  
  // Generate appropriate pages based on the customization options
  const pages = generatePages(childName, childAge, familyStructure, conceptionType);

  const handleOrderClick = () => {
    closePreview();
    
    // Add the item to cart first
    const bookTitle = childName ? `${childName}'s Special Story` : "Your Special Story";
    
    addToCart({
      id: `book-${Date.now()}`,
      title: bookTitle,
      price: 24.99
    });
    
    // Then open checkout
    setTimeout(() => {
      openCheckout();
    }, 300);
  };
  
  const handleAddToCart = () => {
    const bookTitle = childName ? `${childName}'s Special Story` : "Your Special Story";
    
    addToCart({
      id: `book-${Date.now()}`,
      title: bookTitle,
      price: 24.99
    });
    
    closePreview();
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
            <BookPageContent page={pages[currentPage]} />
            <BookPagination 
              pages={pages} 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
            />
          </div>
        </div>
        
        <BookActionButtons 
          onClose={closePreview} 
          onAddToCart={handleAddToCart} 
          onBuyNow={handleOrderClick} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookPreview;
