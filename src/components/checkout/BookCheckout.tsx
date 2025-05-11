
import React from "react";
import { useBookContext } from "@/context/BookContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutSummary from "./CheckoutSummary";

const BookCheckout: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, childName, cartItems } = useBookContext();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Create a Stripe Checkout Session
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer pk_test_51RNY1lFpmfNltxVgEAw8VQ9RaSsfW6zbfBL6qPOXAqY0FmnxvlXOXKHBzypgo3DFoZ6zKPzjc6rTWKabx4Onbo1x00EixeAYJL`
        },
        body: new URLSearchParams({
          'mode': 'payment',
          'success_url': `${window.location.origin}/order-confirmation`,
          'cancel_url': `${window.location.origin}/create`,
          'line_items[0][price_data][currency]': 'usd',
          'line_items[0][price_data][product_data][name]': childName ? `${childName}'s Special Story` : 'Your Special Story',
          'line_items[0][price_data][unit_amount]': '2999',
          'line_items[0][quantity]': '1',
          'shipping_options[0][shipping_rate_data][type]': 'fixed_amount',
          'shipping_options[0][shipping_rate_data][fixed_amount][amount]': '500',
          'shipping_options[0][shipping_rate_data][fixed_amount][currency]': 'usd',
          'shipping_options[0][shipping_rate_data][display_name]': 'Standard Shipping'
        })
      });

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
            <div className="text-xl font-bold text-book-red">$29.99</div>
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

import { useState } from "react";
import { toast } from "sonner";

export default BookCheckout;
