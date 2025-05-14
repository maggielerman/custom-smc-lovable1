
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ShoppingCart, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface BookCheckoutProps {
  bookTitle: string;
  bookPrice: number;
  coverImage?: string;
}

export default function BookCheckout({ bookTitle, bookPrice, coverImage }: BookCheckoutProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    // Create a cart item from the book details
    const cartItem = {
      id: uuidv4(),
      title: bookTitle,
      price: bookPrice,
      quantity: 1,
      image: coverImage || "/placeholder.svg"
    };
    
    // Add a slight delay to show loading state
    setTimeout(() => {
      addToCart(cartItem);
      setIsAddingToCart(false);
      setIsAddedToCart(true);
      
      toast.success(`${bookTitle} added to cart`);
      
      // Reset added state after a few seconds
      setTimeout(() => {
        setIsAddedToCart(false);
      }, 3000);
    }, 500);
  };

  const handleCheckoutClick = () => {
    setIsCheckoutDialogOpen(true);
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.error("Please sign in to proceed to checkout");
      navigate("/auth", { state: { from: window.location.pathname } });
      return;
    }
    
    setIsProcessingCheckout(true);
    
    // Create a cart item from the book details
    const cartItem = {
      id: uuidv4(),
      title: bookTitle,
      price: bookPrice,
      quantity: 1,
      image: coverImage || "/placeholder.svg"
    };
    
    // Add item to cart first
    addToCart(cartItem);
    
    // Simulate checkout process
    setTimeout(() => {
      setIsProcessingCheckout(false);
      setIsCheckoutDialogOpen(false);
      
      // Navigate to checkout page or summary
      navigate("/order-confirmation");
    }, 1000);
  };
  
  return (
    <>
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Book Summary</CardTitle>
          <CardDescription>Customize and order your book</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="font-medium">Book:</div>
            <div>{bookTitle}</div>
          </div>
          
          <div className="flex justify-between items-center text-lg font-bold">
            <div>Price:</div>
            <div>${bookPrice.toFixed(2)}</div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={handleAddToCart}
            disabled={isAddingToCart || isAddedToCart}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding to Cart...
              </>
            ) : isAddedToCart ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
          
          <Button 
            className="w-full bg-book-red hover:bg-red-700"
            onClick={handleCheckoutClick}
          >
            Buy Now
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Summary</DialogTitle>
            <DialogDescription>
              Please review your order before proceeding to checkout.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <div className="font-medium">Book:</div>
              <div>{bookTitle}</div>
            </div>
            
            <div className="flex justify-between items-center border-t pt-4">
              <div className="font-medium">Subtotal:</div>
              <div>${bookPrice.toFixed(2)}</div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="font-medium">Shipping:</div>
              <div>Free</div>
            </div>
            
            <div className="flex justify-between items-center border-t pt-4 text-lg font-bold">
              <div>Total:</div>
              <div>${bookPrice.toFixed(2)}</div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col space-y-3 sm:space-y-0">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsCheckoutDialogOpen(false)}
              disabled={isProcessingCheckout}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-book-red hover:bg-red-700"
              onClick={handleProceedToCheckout}
              disabled={isProcessingCheckout}
            >
              {isProcessingCheckout ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
