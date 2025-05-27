
import React from "react";
import { useCart } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

interface CartProps {
  className?: string;
}

const Cart: React.FC<CartProps> = ({ className }) => {
  const { cartItems, cartCount } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCheckout = () => {
    setIsOpen(false);
    // You can implement checkout logic here or navigate to checkout page
    console.log("Proceeding to checkout with items:", cartItems);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
          aria-label="Open cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-book-red text-xs text-white flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-4">
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <Button 
              className="mt-4 bg-book-red hover:bg-red-400"
              onClick={() => setIsOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div className="border-t pt-4 mt-auto">
              <CartSummary />
              <div className="flex flex-col gap-2 mt-4">
                <Button 
                  className="bg-book-green hover:bg-green-400 text-white"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
