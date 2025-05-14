
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { ShoppingCart, X, CreditCard, Info } from "lucide-react";
import { useBookCustomization } from "@/context/BookCustomizationContext";
import { useCart } from "@/context/CartContext";
import { v4 as uuidv4 } from 'uuid';
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const BookCheckout = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    conceptionType,
    familyStructure,
    childName,
    childAge
  } = useBookCustomization();
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const bookPrice = 29.99;
  const shippingPrice = 4.99;
  const totalPrice = bookPrice + shippingPrice;
  
  const handleAddToCart = () => {
    try {
      setLoading(true);
      
      const bookItem = {
        id: uuidv4(),
        title: childName ? `${childName}'s Story` : "My Special Story",
        type: "customized-book",
        price: bookPrice,
        metadata: {
          conceptionType,
          familyStructure,
          childName: childName || "",
          childAge,
        },
        image: "/placeholder.svg", // Use a real book cover preview image in the future
        quantity: 1,
      };
      
      addToCart(bookItem);
      closeCheckout();
      toast.success("Book added to cart!");
      
      // Navigate to cart or show cart drawer
      setTimeout(() => {
        navigate("/cart");
      }, 500);
      
    } catch (error) {
      console.error("Error adding book to cart:", error);
      toast.error("Failed to add book to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckout = () => {
    if (!user) {
      toast.info("Please sign in to continue with checkout");
      navigate("/auth");
      closeCheckout();
      return;
    }
    
    try {
      setLoading(true);
      
      // Add the item to cart first
      const bookItem = {
        id: uuidv4(),
        title: childName ? `${childName}'s Story` : "My Special Story",
        type: "customized-book",
        price: bookPrice,
        metadata: {
          conceptionType,
          familyStructure,
          childName: childName || "",
          childAge,
        },
        image: "/placeholder.svg", // Use a real book cover preview image in the future
        quantity: 1,
      };
      
      addToCart(bookItem);
      closeCheckout();
      
      // Navigate directly to checkout
      navigate("/checkout");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={closeCheckout}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Complete Your Order</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Book Title:</span>
                <span className="font-medium">
                  {childName ? `${childName}'s Story` : "My Special Story"}
                </span>
                
                <span className="text-muted-foreground">Conception Type:</span>
                <span className="capitalize font-medium">
                  {conceptionType.replace('-', ' ')}
                </span>
                
                <span className="text-muted-foreground">Family Structure:</span>
                <span className="capitalize font-medium">
                  {familyStructure === 'hetero-couple' 
                    ? 'Two Parents (Mom & Dad)' 
                    : familyStructure === 'two-moms'
                      ? 'Two Moms'
                      : familyStructure === 'two-dads'
                        ? 'Two Dads'
                        : familyStructure === 'single-mom'
                          ? 'Single Mom'
                          : 'Single Dad'}
                </span>
                
                <span className="text-muted-foreground">Child Age Group:</span>
                <span className="font-medium">Ages {childAge}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Book Price</span>
                  <span>${bookPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Estimated Shipping</span>
                  <span>${shippingPrice.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <CardFooter className={cn("flex flex-col space-y-2 px-0 pt-0")}>
            <Button
              className="w-full bg-book-red hover:bg-red-700 text-white"
              onClick={handleCheckout}
              disabled={loading}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {loading ? "Processing..." : "Proceed to Checkout"}
            </Button>
            <Button
              variant="outline"
              className="w-full border-book-red text-book-red hover:bg-book-red/10"
              onClick={handleAddToCart}
              disabled={loading}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {loading ? "Processing..." : "Add to Cart"}
            </Button>
          </CardFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookCheckout;
