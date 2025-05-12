
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface BookActionButtonsProps {
  onClose: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const BookActionButtons: React.FC<BookActionButtonsProps> = ({ onClose, onAddToCart, onBuyNow }) => {
  return (
    <div className="flex justify-center mt-6">
      <Button 
        className="bg-book-red hover:bg-red-400 text-white"
        onClick={onClose}>
        Customize More
      </Button>
      <Button 
        className="bg-book-green hover:bg-green-400 text-white ml-4 flex items-center gap-2"
        onClick={onAddToCart}
      >
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </Button>
      <Button 
        className="bg-book-green hover:bg-green-400 text-white ml-2 flex items-center gap-2"
        onClick={onBuyNow}
      >
        Buy Now
      </Button>
    </div>
  );
};

export default BookActionButtons;
