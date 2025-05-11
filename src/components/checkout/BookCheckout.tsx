
import React, { useState } from "react";
import { useBookContext } from "@/context/BookContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutSummary from "./CheckoutSummary";
import { toast } from "sonner";

const BookCheckout: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, childName, cartItems } = useBookContext();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Create a Stripe Checkout Session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            name: item.title,
            amount: item.price,
            quantity: 1
          })),
          success_url: `${window.location.origin}/order-confirmation`,
          cancel_url: `${window.location.origin}/create`,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const session = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={(open) => !open && closeCheckout()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="my-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">
              {childName ? `${childName}'s Special Story` : "Your Special Story"}
            </h2>
            <div className="text-xl font-bold text-book-red">${(29.99).toFixed(2)}</div>
          </div>
          
          <CheckoutSummary />
          
          <div className="mt-6">
            <Button 
              onClick={handleCheckout} 
              className="w-full bg-book-green hover:bg-green-600 text-white"
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Secure Checkout"}
            </Button>
            <p className="text-center text-gray-500 text-sm mt-2">
              You'll be redirected to Stripe's secure checkout page
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookCheckout;
