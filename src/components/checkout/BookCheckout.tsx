
import React from "react";
import { useBookContext } from "@/context/BookContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// Using the provided Stripe publishable key
const stripePromise = loadStripe("pk_test_51RNY1lFpmfNltxVgEAw8VQ9RaSsfW6zbfBL6qPOXAqY0FmnxvlXOXKHBzypgo3DFoZ6zKPzjc6rTWKabx4Onbo1x00EixeAYJL");

const BookCheckout: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, childName } = useBookContext();

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={(open) => !open && closeCheckout()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <Elements stripe={stripePromise}>
          <CheckoutForm bookName={childName ? `${childName}'s Special Story` : "Your Special Story"} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default BookCheckout;
